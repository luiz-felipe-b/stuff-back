import brevo from '@getbrevo/brevo'
import { env } from '../../../../env.ts';


/**
 * Interface for email recipient
 */
interface EmailRecipient {
    email: string;
    name?: string;
}

/**
 * Interface for email attachment
 */
interface EmailAttachment {
    name: string;
    content: string;
    contentType: string;
}

/**
 * Options for sending an email
 */
interface EmailOptions {
    to: EmailRecipient[];
    subject: string;
    htmlContent: string;
    textContent?: string;
    cc?: EmailRecipient[];
    bcc?: EmailRecipient[];
    replyTo?: EmailRecipient;
    attachments?: EmailAttachment[];
}

/**
 * Email service for sending emails
 */
export class EmailService {
    private readonly apiInstance: brevo.TransactionalEmailsApi;
    private readonly apiKey: string;
    private readonly sendSmtpEmail: brevo.SendSmtpEmail;
    private readonly defaultSender: EmailRecipient;
    
    /**
     * Creates a new instance of EmailService
     * @param apiKey - Brevo API key
     * @param defaultSenderEmail - Default sender email address
     * @param defaultSenderName - Default sender name
     */
    constructor(

    ) {
        this.apiInstance = new brevo.TransactionalEmailsApi();

        this.apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, env.BREVO_API_KEY);

        this.sendSmtpEmail = new brevo.SendSmtpEmail();

    }
    
    /**
     * Sends an email with the provided options
     * @param options - Email options
     * @returns Promise resolving to true if email was sent successfully, false otherwise
     */
    async sendEmail(): Promise<boolean> {
        try {
            const sendSmtpEmail = new brevo.SendSmtpEmail();

            sendSmtpEmail.subject = "My {{params.subject}}";
            sendSmtpEmail.htmlContent = "<html><body><h1>Common: This is my first transactional email {{params.parameter}}</h1></body></html>";
            sendSmtpEmail.sender = { "name": "John", "email": "lfbalaminute@hotmail.com" };
            sendSmtpEmail.to = [
              { "email": "lfbalaminute@hotmail.com", "name": "Luiz Felipe" }
            ];
            sendSmtpEmail.replyTo = { "email": "lfbalaminute@hotmail.com", "name": "Luiz Felipe" };
            sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
            sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };

            const data = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            console.log('API called successfully. Returned data: ' + JSON.stringify(data));
            
            // email.to = options.to;
            // email.subject = options.subject;
            // email.htmlContent = options.htmlContent;
            // email.sender = this.defaultSender;
            
            // if (options.textContent) email.textContent = options.textContent;
            // if (options.cc) email.cc = options.cc;
            // if (options.bcc) email.bcc = options.bcc;
            // if (options.replyTo) email.replyTo = options.replyTo;
            // if (options.attachments) email.attachment = options.attachments;
            
            return true;
        } catch (error) {
            console.error('Failed to send email:', error);
            return false;
        }
    }
    
    // /**
    //  * Sends an email using a pre-defined template
    //  * @param templateId - ID of the template in Brevo
    //  * @param to - Recipients
    //  * @param params - Parameters to be used in the template
    //  * @param options - Additional email options
    //  * @returns Promise resolving to true if email was sent successfully, false otherwise
    //  */
    // async sendTemplateEmail(
    //     templateId: number,
    //     to: EmailRecipient[],
    //     params: Record<string, any> = {},
    //     options: Partial<Omit<EmailOptions, 'to' | 'subject' | 'htmlContent'>> = {}
    // ): Promise<boolean> {
    //     try {
    //         const email = new SibApiV3Sdk.SendSmtpEmail();
            
    //         email.templateId = templateId;
    //         email.to = to;
    //         email.params = params;
    //         email.sender = this.defaultSender;
            
    //         if (options.cc) email.cc = options.cc;
    //         if (options.bcc) email.bcc = options.bcc;
    //         if (options.replyTo) email.replyTo = options.replyTo;
    //         if (options.attachments) email.attachment = options.attachments;
            
    //         await this.apiInstance.sendTransacEmail(email);
    //         return true;
    //     } catch (error) {
    //         console.error('Failed to send template email:', error);
    //         return false;
    //     }
    // }

    /**
     * Utility method to create an email recipient object
     * @param email - Email address
     * @param name - Name (optional)
     * @returns Email recipient object
     */
    static createRecipient(email: string, name?: string): EmailRecipient {
        return { email, ...(name && { name }) };
    }
}