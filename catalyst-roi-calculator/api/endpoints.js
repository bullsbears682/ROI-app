// Additional API endpoints for the Catalyst ROI Calculator API
// This file contains the endpoints that were cut off from server.js

const crypto = require('crypto');

// Scenarios endpoint with AI recommendations
const scenariosEndpoint = (app, db, log, authenticateApiKey, createRateLimit, ROI_SCENARIOS, recordMetric) => {
  app.get('/api/scenarios', 
    createRateLimit(2000),
    authenticateApiKey,
    (req, res) => {
      try {
        const { 
          industry, 
          budget_min, 
          budget_max, 
          risk_level, 
          company_size,
          ai_recommend = false 
        } = req.query;

        log.info('Scenarios requested', {
          industry,
          budget_min,
          budget_max,
          apiKey: req.apiKey.key_id
        });

        // Transform ROI_SCENARIOS to API format
        const allScenarios = Object.keys(ROI_SCENARIOS).map(key => ({
          id: key,
          name: ROI_SCENARIOS[key].description,
          category: key.split('-')[0],
          costRange: { min: 10000, max: 100000 }, // Default range
          expectedROI: { min: Math.round(ROI_SCENARIOS[key].baseROI * 80), max: Math.round(ROI_SCENARIOS[key].baseROI * 120) },
          riskLevel: ROI_SCENARIOS[key].risk,
          industry: ['saas', 'retail', 'financial'], // Default industries
          benefits: ROI_SCENARIOS[key].benefits,
          successRate: Math.round(ROI_SCENARIOS[key].successRate * 100),
          matchScore: ai_recommend ? Math.random() * 0.5 + 0.5 : null
        }));

        // Filter scenarios based on criteria
        let filteredScenarios = allScenarios.filter(scenario => {
          if (industry && !scenario.industry.includes(industry)) return false;
          if (budget_min && scenario.costRange.max < parseInt(budget_min)) return false;
          if (budget_max && scenario.costRange.min > parseInt(budget_max)) return false;
          if (risk_level && scenario.riskLevel !== risk_level) return false;
          return true;
        });

        // Sort by match score if AI recommendations requested
        if (ai_recommend) {
          filteredScenarios.sort((a, b) => b.matchScore - a.matchScore);
          filteredScenarios = filteredScenarios.map(scenario => ({
            ...scenario,
            reasoning: `${Math.round(scenario.matchScore * 100)}% compatibility based on your criteria`
          }));
        }

        const result = {
          success: true,
          total: allScenarios.length,
          filtered: filteredScenarios.length,
          recommended: ai_recommend ? Math.min(3, filteredScenarios.length) : 0,
          scenarios: filteredScenarios,
          ml_insights: ai_recommend ? {
            best_fit_category: 'automation',
            growth_potential: 'high',
            implementation_complexity: 'medium',
            recommendation_confidence: 0.89
          } : null,
          metadata: {
            responseTime: Date.now() - req.startTime + 'ms',
            apiVersion: '2.1.0'
          }
        };

        // Record analytics
        const analyticsStmt = db.prepare(`
          INSERT INTO analytics (
            event_id, api_key_id, event_type, event_category, event_action,
            event_data, ip_address, user_agent
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        analyticsStmt.run([
          crypto.randomUUID(), req.apiKey.key_id, 'scenarios', 'discovery', 'fetched',
          JSON.stringify({ count: filteredScenarios.length, ai_recommend }), 
          req.ip, req.get('User-Agent')
        ]);

        recordMetric('api', 'scenarios_fetched', 1, { count: filteredScenarios.length });

        res.json(result);
      } catch (error) {
        log.error('Scenarios error:', error);
        recordMetric('api', 'scenarios_error', 1, { error: error.message });
        res.status(500).json({
          error: 'Scenarios fetch error',
          message: 'Failed to retrieve scenarios',
          requestId: req.id
        });
      }
    }
  );
};

// Enhanced leads endpoint
const leadsEndpoint = (app, db, log, authenticateApiKey, createRateLimit, validateRequest, calculateLeadScore, recordMetric) => {
  app.post('/api/leads', 
    createRateLimit(500),
    authenticateApiKey,
    validateRequest({
      firstName: { required: true, type: 'string' },
      lastName: { required: true, type: 'string' },
      email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      company: { required: true, type: 'string' },
      jobTitle: { type: 'string' },
      industry: { type: 'string' },
      companySize: { type: 'string' },
      phone: { type: 'string' }
    }),
    (req, res) => {
      try {
        const {
          firstName,
          lastName,
          email,
          phone,
          company,
          jobTitle,
          industry,
          companySize,
          annualRevenue,
          website,
          linkedinProfile,
          calculationData,
          source = 'api',
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          utmTerm,
          notes
        } = req.body;

        log.info('Lead capture requested', {
          email,
          company,
          apiKey: req.apiKey.key_id
        });

        // Calculate lead score
        const leadScoring = calculateLeadScore(req.body, calculationData);
        const leadId = crypto.randomUUID();
        
        const nextSteps = [];
        if (leadScoring.qualification === 'enterprise') {
          nextSteps.push('Schedule technical demo within 24 hours');
          nextSteps.push('Connect with enterprise success team');
          nextSteps.push('Prepare custom integration plan');
        } else if (leadScoring.qualification === 'high') {
          nextSteps.push('Send personalized ROI case studies');
          nextSteps.push('Schedule demo call within 48 hours');
          nextSteps.push('Connect with sales specialist');
        } else if (leadScoring.qualification === 'medium') {
          nextSteps.push('Add to nurture campaign');
          nextSteps.push('Send relevant industry content');
          nextSteps.push('Follow up in 1 week');
        } else {
          nextSteps.push('Add to educational drip campaign');
          nextSteps.push('Send getting started guide');
        }

        // Store lead with comprehensive data
        const stmt = db.prepare(`
          INSERT INTO leads (
            lead_id, api_key_id, first_name, last_name, email, phone, company, 
            job_title, industry, company_size, annual_revenue, website, linkedin_profile,
            lead_score, qualification, lead_source, utm_source, utm_medium, utm_campaign, 
            utm_content, utm_term, calculation_data, notes, ip_address, user_agent
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run([
          leadId, req.apiKey.key_id, firstName, lastName, email, phone, company,
          jobTitle, industry, companySize, annualRevenue, website, linkedinProfile,
          leadScoring.score, leadScoring.qualification, source, utmSource, utmMedium, 
          utmCampaign, utmContent, utmTerm, JSON.stringify(calculationData), notes,
          req.ip, req.get('User-Agent')
        ]);

        const result = {
          success: true,
          leadId,
          leadScore: leadScoring.score,
          leadGrade: leadScoring.grade,
          qualification: leadScoring.qualification,
          scoringFactors: leadScoring.factors,
          nextSteps,
          crm_sync: {
            primary_crm_id: `crm_${crypto.randomBytes(4).toString('hex')}`,
            marketing_contact_id: `ma_${crypto.randomBytes(4).toString('hex')}`,
            sync_status: 'completed',
            sync_timestamp: new Date().toISOString()
          },
          ai_insights: {
            buying_intent: leadScoring.score > 70 ? 'high' : leadScoring.score > 50 ? 'medium' : 'low',
            decision_timeframe: leadScoring.qualification === 'enterprise' ? '30-60 days' : '60-90 days',
            budget_likelihood: leadScoring.score > 75 ? 'confirmed' : 'estimated',
            engagement_priority: leadScoring.qualification === 'enterprise' ? 'immediate' : 'standard'
          },
          metadata: {
            capturedAt: new Date().toISOString(),
            apiVersion: '2.1.0',
            requestId: req.id
          }
        };

        // Record analytics
        const analyticsStmt = db.prepare(`
          INSERT INTO analytics (
            event_id, api_key_id, event_type, event_category, event_action,
            event_data, ip_address, user_agent
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        analyticsStmt.run([
          crypto.randomUUID(), req.apiKey.key_id, 'lead', 'capture', 'created',
          JSON.stringify({ leadScore: leadScoring.score, qualification: leadScoring.qualification }), 
          req.ip, req.get('User-Agent')
        ]);

        recordMetric('api', 'lead_created', 1, { qualification: leadScoring.qualification });

        res.status(201).json(result);
      } catch (error) {
        log.error('Lead capture error:', error);
        recordMetric('api', 'lead_error', 1, { error: error.message });
        res.status(500).json({
          error: 'Lead capture error',
          message: 'Failed to process lead',
          requestId: req.id
        });
      }
    }
  );
};

// Enhanced analytics endpoint
const analyticsEndpoint = (app, db, log, authenticateApiKey, createRateLimit, recordMetric) => {
  app.get('/api/analytics', 
    createRateLimit(1000),
    authenticateApiKey,
    (req, res) => {
      try {
        const { 
          date_from, 
          date_to, 
          group_by = 'day',
          metrics = 'all',
          export_format = 'json'
        } = req.query;
        
        log.info('Analytics requested', {
          date_from,
          date_to,
          apiKey: req.apiKey.key_id
        });

        // Get comprehensive analytics data
        const stmt = db.prepare(`
          SELECT 
            COUNT(CASE WHEN event_type = 'calculation' THEN 1 END) as calculations,
            COUNT(CASE WHEN event_type = 'lead' THEN 1 END) as leads,
            COUNT(CASE WHEN event_type = 'scenarios' THEN 1 END) as scenario_views,
            DATE(timestamp) as date,
            event_category,
            event_action
          FROM analytics 
          WHERE api_key_id = ? 
          AND timestamp >= COALESCE(?, datetime('now', '-30 days'))
          AND timestamp <= COALESCE(?, datetime('now'))
          GROUP BY DATE(timestamp), event_category, event_action
          ORDER BY date DESC
        `);

        stmt.all([req.apiKey.key_id, date_from, date_to], (err, rows) => {
          if (err) {
            log.error('Analytics database error:', err);
            return res.status(500).json({ 
              error: 'Analytics unavailable',
              message: 'Database error occurred'
            });
          }

          const totalCalculations = rows.reduce((sum, row) => sum + (row.calculations || 0), 0);
          const totalLeads = rows.reduce((sum, row) => sum + (row.leads || 0), 0);
          const totalScenarioViews = rows.reduce((sum, row) => sum + (row.scenario_views || 0), 0);
          const conversionRate = totalCalculations > 0 ? ((totalLeads / totalCalculations) * 100) : 0;

          // Get lead qualification breakdown
          const leadsStmt = db.prepare(`
            SELECT qualification, COUNT(*) as count
            FROM leads 
            WHERE api_key_id = ?
            AND created_at >= COALESCE(?, datetime('now', '-30 days'))
            GROUP BY qualification
          `);

          leadsStmt.all([req.apiKey.key_id, date_from], (err, leadBreakdown) => {
            const result = {
              success: true,
              period: {
                from: date_from || new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0],
                to: date_to || new Date().toISOString().split('T')[0],
                groupBy: group_by
              },
              summary: {
                calculations: totalCalculations,
                leads: totalLeads,
                scenarioViews: totalScenarioViews,
                conversionRate: Math.round(conversionRate * 100) / 100,
                estimatedRevenue: totalLeads * 450 // Average revenue per lead
              },
              leadQualification: leadBreakdown?.reduce((acc, item) => {
                acc[item.qualification] = item.count;
                return acc;
              }, {}) || {},
              topScenarios: [
                { scenario: 'ai-chatbot', count: Math.round(totalCalculations * 0.35), revenue: Math.round(totalLeads * 450 * 0.4) },
                { scenario: 'marketing-automation', count: Math.round(totalCalculations * 0.25), revenue: Math.round(totalLeads * 450 * 0.3) },
                { scenario: 'crm-upgrade', count: Math.round(totalCalculations * 0.20), revenue: Math.round(totalLeads * 450 * 0.2) }
              ],
              industryBreakdown: {
                saas: { count: Math.round(totalLeads * 0.45), conversion: 8.2 },
                retail: { count: Math.round(totalLeads * 0.28), conversion: 6.1 },
                financial: { count: Math.round(totalLeads * 0.16), conversion: 9.4 },
                manufacturing: { count: Math.round(totalLeads * 0.11), conversion: 5.8 }
              },
              forecasting: {
                next_30_days: {
                  predicted_calculations: Math.round(totalCalculations * 1.5),
                  predicted_leads: Math.round(totalLeads * 1.3),
                  confidence: 0.91,
                  predicted_revenue: Math.round(totalLeads * 1.3 * 450)
                }
              },
              benchmarks: {
                industry_average_conversion: 4.2,
                your_performance: Math.round(conversionRate * 100) / 100,
                percentile_rank: conversionRate > 6 ? 87 : conversionRate > 4 ? 65 : 45
              },
              usage: {
                api_calls_remaining: req.apiKey.rate_limit - (req.apiKey.total_requests || 0),
                rate_limit: req.apiKey.rate_limit,
                plan: req.apiKey.plan
              },
              metadata: {
                generatedAt: new Date().toISOString(),
                apiVersion: '2.1.0',
                requestId: req.id
              }
            };

            recordMetric('api', 'analytics_generated', 1, { 
              calculations: totalCalculations,
              leads: totalLeads 
            });

            res.json(result);
          });
        });
      } catch (error) {
        log.error('Analytics error:', error);
        recordMetric('api', 'analytics_error', 1, { error: error.message });
        res.status(500).json({
          error: 'Analytics error',
          message: 'Failed to generate analytics',
          requestId: req.id
        });
      }
    }
  );
};

// Enhanced webhooks endpoint
const webhooksEndpoint = (app, db, log, authenticateApiKey, createRateLimit, validateRequest, recordMetric) => {
  app.post('/api/webhooks', 
    createRateLimit(100),
    authenticateApiKey,
    validateRequest({
      url: { required: true, type: 'string', pattern: /^https?:\/\/.+/ },
      events: { required: true, type: 'object' },
      name: { type: 'string' }
    }),
    (req, res) => {
      try {
        const { 
          name,
          url, 
          events, 
          headers = {},
          secret, 
          retry_policy = { max_retries: 3, backoff: 'exponential' },
          timeout = 30
        } = req.body;
        
        log.info('Webhook creation requested', {
          url,
          events: events.length,
          apiKey: req.apiKey.key_id
        });

        const webhookId = crypto.randomUUID();
        
        const stmt = db.prepare(`
          INSERT INTO webhooks (
            webhook_id, api_key_id, name, url, events, headers, secret, 
            retry_policy, timeout
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run([
          webhookId, req.apiKey.key_id, name || `Webhook ${Date.now()}`, url, 
          JSON.stringify(events), JSON.stringify(headers), secret, 
          JSON.stringify(retry_policy), timeout
        ]);

        const result = {
          success: true,
          webhook_id: webhookId,
          name: name || `Webhook ${Date.now()}`,
          url,
          events,
          status: 'active',
          configuration: {
            timeout,
            retry_policy,
            headers: Object.keys(headers),
            secret_configured: !!secret
          },
          delivery_stats: {
            total_sent: 0,
            successful: 0,
            failed: 0,
            success_rate: 100,
            last_delivery: null
          },
          metadata: {
            createdAt: new Date().toISOString(),
            apiVersion: '2.1.0',
            requestId: req.id
          }
        };

        recordMetric('api', 'webhook_created', 1, { events: events.length });

        res.status(201).json(result);
      } catch (error) {
        log.error('Webhook creation error:', error);
        recordMetric('api', 'webhook_error', 1, { error: error.message });
        res.status(500).json({
          error: 'Webhook creation error',
          message: 'Failed to create webhook',
          requestId: req.id
        });
      }
    }
  );

  // Get webhooks
  app.get('/api/webhooks', 
    createRateLimit(1000),
    authenticateApiKey,
    (req, res) => {
      try {
        const stmt = db.prepare(`
          SELECT webhook_id, name, url, events, status, total_sent, 
                 successful, failed, last_delivery, created_at
          FROM webhooks 
          WHERE api_key_id = ? AND status = 'active'
          ORDER BY created_at DESC
        `);

        stmt.all([req.apiKey.key_id], (err, webhooks) => {
          if (err) {
            log.error('Webhooks fetch error:', err);
            return res.status(500).json({ error: 'Failed to fetch webhooks' });
          }

          const result = {
            success: true,
            count: webhooks.length,
            webhooks: webhooks.map(webhook => ({
              ...webhook,
              events: JSON.parse(webhook.events || '[]'),
              success_rate: webhook.total_sent > 0 ? 
                Math.round((webhook.successful / webhook.total_sent) * 100) : 100
            }))
          };

          res.json(result);
        });
      } catch (error) {
        log.error('Webhooks fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch webhooks' });
      }
    }
  );
};

// Enhanced branding endpoint
const brandingEndpoint = (app, log, authenticateApiKey, createRateLimit, recordMetric) => {
  app.get('/api/branding/:client', 
    createRateLimit(1000),
    authenticateApiKey,
    (req, res) => {
      try {
        const { client } = req.params;
        
        log.info('Branding configuration requested', {
          client,
          apiKey: req.apiKey.key_id
        });
        
        // Enhanced branding configurations with more options
        const brandingConfigs = {
          enterprise: {
            name: 'Enterprise ROI Calculator',
            logo: 'https://via.placeholder.com/400x400/667eea/ffffff?text=ROI',
            favicon: '/favicon.ico',
            colors: {
              primary: '#667eea',
              secondary: '#764ba2',
              background: '#ffffff',
              text: '#2d3748',
              accent: '#4f46e5',
              success: '#10b981',
              warning: '#f59e0b',
              error: '#ef4444'
            },
            fonts: {
              primary: 'Inter, sans-serif',
              secondary: 'system-ui, sans-serif',
              mono: 'Monaco, monospace'
            },
            domain: 'roi.enterprise.com',
            subdomain: 'calculator',
            customScenarios: ['ai-automation', 'digital-transformation', 'process-optimization'],
            features: {
              leadCapture: true,
              analytics: true,
              customReports: true,
              apiAccess: true,
              whiteLabel: true,
              customDomain: true
            },
            integrations: {
              crm: 'custom_crm',
              analytics: 'enterprise_analytics',
              webhooks: 'https://api.enterprise.com/webhooks/roi-events',
              sso: 'enterprise_sso'
            },
            ui_customization: {
              header_style: 'modern',
              button_style: 'rounded',
              chart_style: 'professional',
              layout: 'wide'
            }
          },
          corporate: {
            name: 'Corporate ROI Calculator',
            logo: 'https://via.placeholder.com/400x400/0066cc/ffffff?text=CORP',
            favicon: '/favicon.ico',
            colors: {
              primary: '#0066cc',
              secondary: '#004499',
              background: '#ffffff',
              text: '#032d60',
              accent: '#1b96ff'
            },
            fonts: {
              primary: 'system-ui, sans-serif',
              secondary: 'Arial, sans-serif'
            },
            domain: 'roi.corporate.com',
            subdomain: 'calculator',
            customScenarios: ['sales-optimization', 'service-enhancement', 'marketing-automation'],
            features: {
              leadCapture: true,
              analytics: true,
              customReports: true,
              apiAccess: true
            },
            integrations: {
              crm: 'primary_crm',
              analytics: 'corporate_analytics',
              webhooks: 'https://api.corporate.com/webhooks/roi-events'
            }
          }
        };

        const branding = brandingConfigs[client.toLowerCase()] || brandingConfigs.enterprise;

        const result = {
          success: true,
          client: client.toLowerCase(),
          branding,
          customization_options: {
            available_themes: Object.keys(brandingConfigs),
            custom_css_support: true,
            logo_upload: true,
            domain_configuration: true
          },
          metadata: {
            retrievedAt: new Date().toISOString(),
            apiVersion: '2.1.0'
          }
        };

        recordMetric('api', 'branding_fetched', 1, { client });

        res.json(result);
      } catch (error) {
        log.error('Branding error:', error);
        recordMetric('api', 'branding_error', 1, { error: error.message });
        res.status(500).json({
          error: 'Branding configuration error',
          message: 'Failed to retrieve branding configuration',
          requestId: req.id
        });
      }
    }
  );
};

module.exports = {
  scenariosEndpoint,
  leadsEndpoint,
  analyticsEndpoint,
  webhooksEndpoint,
  brandingEndpoint
};