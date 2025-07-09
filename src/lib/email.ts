import { SMTP_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from '$env/static/private';
import nodemailer from 'nodemailer';

const mailer = nodemailer.createTransport({
	host: String(SMTP_HOST),
	port: Number(SMTP_PORT),
	secure: false,
	auth: {
		user: String(SMTP_USER),
		pass: String(SMTP_PASS),
	},
	tls: {
		rejectUnauthorized: false,
	},
});

export async function testMailer() {
	console.log((await mailer.verify()) ? 'mailer connected' : 'mailer failed to connect');
}

interface Email {
	from?: string;
	to: string;
	subject: string;
	html: string;
}

export async function sendEmail(email: Email) {
	try {
		if (!email.from) email.from = SMTP_FROM;
		await new Promise((resolve, reject) => {
			mailer.sendMail(email, (e, info) => {
				if (e instanceof Error) {
					reject(e.message);
				}
				resolve(null);
			});
		});
		console.log('email sent');
	} catch (e) {
		console.log('email failed to send:', email);
	}
}
