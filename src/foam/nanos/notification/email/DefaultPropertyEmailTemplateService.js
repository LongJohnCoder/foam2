/**
 * @license
 * Copyright 2019 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.notification.email',
  name: 'DefaultPropertyEmailTemplateService',

  implements: [
    'foam.nanos.notification.email.EmailPropertyService'
  ],

  methods: [
    {
      name: 'apply',
      type: 'foam.nanos.notification.email.EmailMessage',
      args: [
        {
          name: 'x',
          type: 'Context',
        },
        {
          name: 'group',
          type: 'foam.nanos.auth.Group',
          documentation: 'group of user whose the recipient of the email being sent'
        },
        {
          name: 'emailMessage',
          type: 'foam.nanos.notification.email.EmailMessage',
          documentation: 'Email message'
        },
        {
          name: 'templateArgs',
          type: 'Map',
          documentation: 'Template arguments'
        }
      ],
    }
  ],
  javaCode: `
  Logger logger = (Logger) x.get("logger");
  EmailConfig emailConfig = (EmailConfig) x.get("emailConfig");

  // Service property check
  if ( emailConfig == null || SafetyUtil.isEmpty(emailConfig.getReplyTo()) || SafetyUtil.isEmpty(emailConfig.getDisplayName()) || SafetyUtil.isEmpty(emailConfig.getFrom()) ) {
    logger.error( "EmailConfig service has invalid property settings.");
    return emailMessage;
  }

  // REPLY TO:
  if ( SafetyUtil.isEmpty(emailMessage.getReplyTo()) ) {
    emailMessage.setReplyTo(emailConfig.getReplyTo());
  }

  // DISPLAY NAME:
  if ( SafetyUtil.isEmpty(emailMessage.getDisplayName()) )
    emailMessage.setDisplayName(emailConfig.getDisplayName());
  }

  // FROM:
  if ( SafetyUtil.isEmpty(emailMessage.getFrom()) ) {
    emailMessage.setFrom(emailConfig.getFrom());
  }

  return emailMessage;
  `
});
