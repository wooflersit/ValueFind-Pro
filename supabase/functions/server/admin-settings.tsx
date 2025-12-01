// Admin Settings Routes for ValueFind Pro

import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const adminSettingsRouter = new Hono();

// Get Maps Configuration
adminSettingsRouter.get('/make-server-ced858b5/admin/settings/maps-config', async (c) => {
  try {
    const config = await kv.get('settings:maps_config');
    if (!config) {
      return c.json({ enabled: false, provider: 'google', apiKey: '' });
    }
    return c.json(config);
  } catch (error: any) {
    console.error('Get maps config error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Save Maps Configuration
adminSettingsRouter.post('/make-server-ced858b5/admin/settings/maps-config', async (c) => {
  try {
    const { config } = await c.req.json();
    await kv.set('settings:maps_config', config);
    console.log('Maps configuration saved:', config);
    return c.json({ success: true, config });
  } catch (error: any) {
    console.error('Save maps config error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get SMS Configuration
adminSettingsRouter.get('/make-server-ced858b5/admin/settings/sms-config', async (c) => {
  try {
    const config = await kv.get('settings:sms_config');
    if (!config) {
      return c.json({ enabled: false, provider: 'msg91', apiKey: '', senderId: '' });
    }
    return c.json(config);
  } catch (error: any) {
    console.error('Get SMS config error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Save SMS Configuration
adminSettingsRouter.post('/make-server-ced858b5/admin/settings/sms-config', async (c) => {
  try {
    const { config } = await c.req.json();
    await kv.set('settings:sms_config', config);
    console.log('SMS configuration saved:', config);
    return c.json({ success: true, config });
  } catch (error: any) {
    console.error('Save SMS config error:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default adminSettingsRouter;
