// SMS Service Implementation for ValueFind Pro
// Supports: MSG91, Textlocal, Fast2SMS, Twilio

export interface SMSConfig {
  enabled: boolean;
  provider: 'msg91' | 'textlocal' | 'fast2sms' | 'twilio';
  apiKey: string;
  senderId?: string;
  templateId?: string;
  accountSid?: string; // For Twilio
  authToken?: string; // For Twilio
  fromNumber?: string; // For Twilio
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// MSG91 Implementation
export const sendSMS_MSG91 = async (
  config: SMSConfig,
  phone: string,
  message: string
): Promise<SMSResponse> => {
  try {
    const url = 'https://api.msg91.com/api/v5/flow/';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'authkey': config.apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: config.senderId,
        short_url: '0',
        mobiles: phone.replace('+91', ''),
        var1: message,
        template_id: config.templateId,
      }),
    });

    const data = await response.json();
    return {
      success: data.type === 'success',
      messageId: data.message_id,
      error: data.message,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Textlocal Implementation
export const sendSMS_Textlocal = async (
  config: SMSConfig,
  phone: string,
  message: string
): Promise<SMSResponse> => {
  try {
    const url = 'https://api.textlocal.in/send/';
    const params = new URLSearchParams({
      apikey: config.apiKey,
      numbers: phone.replace('+91', ''),
      sender: config.senderId || 'TXTLCL',
      message: message,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    const data = await response.json();
    return {
      success: data.status === 'success',
      messageId: data.messages?.[0]?.id,
      error: data.errors?.[0]?.message,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Fast2SMS Implementation
export const sendSMS_Fast2SMS = async (
  config: SMSConfig,
  phone: string,
  message: string
): Promise<SMSResponse> => {
  try {
    const url = 'https://www.fast2sms.com/dev/bulkV2';
    const params = new URLSearchParams({
      authorization: config.apiKey,
      route: 'v3',
      sender_id: config.senderId || 'FSTSMS',
      message: message,
      language: 'english',
      flash: '0',
      numbers: phone.replace('+91', ''),
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    const data = await response.json();
    return {
      success: data.return === true,
      messageId: data.request_id,
      error: data.message,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Twilio Implementation
export const sendSMS_Twilio = async (
  config: SMSConfig,
  phone: string,
  message: string
): Promise<SMSResponse> => {
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`;
    const auth = btoa(`${config.accountSid}:${config.authToken}`);
    const params = new URLSearchParams({
      To: phone,
      From: config.fromNumber || '',
      Body: message,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const data = await response.json();
    return {
      success: data.status === 'sent' || data.status === 'queued',
      messageId: data.sid,
      error: data.error_message,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Main SMS Sender
export const sendSMS = async (
  config: SMSConfig,
  phone: string,
  message: string
): Promise<SMSResponse> => {
  if (!config.enabled) {
    return { success: false, error: 'SMS is not enabled' };
  }

  switch (config.provider) {
    case 'msg91':
      return sendSMS_MSG91(config, phone, message);
    case 'textlocal':
      return sendSMS_Textlocal(config, phone, message);
    case 'fast2sms':
      return sendSMS_Fast2SMS(config, phone, message);
    case 'twilio':
      return sendSMS_Twilio(config, phone, message);
    default:
      return { success: false, error: 'Invalid SMS provider' };
  }
};
