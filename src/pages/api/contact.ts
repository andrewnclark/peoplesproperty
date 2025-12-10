import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          message: 'Please fill in all required fields (Name, Email, Message).',
        }),
        { status: 400 }
      );
    }

    // Create a Nodemailer transporter using SMTP
    // In a real application, you would use environment variables for these credentials
    // For Vercel, you'd set these as environment variables in your project settings.
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email', // Replace with your SMTP host (e.g., smtp.sendgrid.net, smtp.mailgun.org)
      port: 587, // Or 465 for SSL
      secure: false, // Use 'true' if port is 465, 'false' otherwise
      auth: {
        user: 'your_smtp_username', // Replace with your SMTP username
        pass: 'your_smtp_password', // Replace with your SMTP password
      },
    });

    const mailOptions = {
      from: `"Contact Form" <${email}>`, // Sender address
      to: 'info@peoplesblockmanagement.com', // Recipient address
      subject: `New Contact Form Submission: ${subject || 'No Subject'}`, // Subject line
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({
        message: 'Your message has been sent successfully!',
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({
        message: 'Failed to send your message. Please try again later.',
      }),
      { status: 500 }
    );
  }
};
