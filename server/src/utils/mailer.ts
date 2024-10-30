import { User } from "../models/userModel";
import { SmtpType } from "../@types";
import nodemailer from "nodemailer";
import pug from "pug";
import { convert } from "html-to-text";

const emailFrom = process.env.EMAIL_FROM as string;
const sendgridUser = process.env.SENDGRID_USERNAME as string;
const sendgridPass = process.env.SENDGRID_PASSWORD as string;

const SMTP = {
  user: process.env.SMTP_USERNAME,
  pass: process.env.SMTP_PASSWORD,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
};

export default class Email {
  to: string;
  firstName: string;
  url: string;
  from: string;
  constructor(user: User, url: string) {
    this.to = user.email;
    this.firstName = user.userName.split(" ")[0];
    this.url = url;
    this.from = emailFrom;
  }

  transporter() {
    const smtp = SMTP as SmtpType;
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: { user: sendgridUser, pass: sendgridPass },
      });
    }
    return nodemailer.createTransport({
      host: smtp.host,
      port: Number(smtp.port),
      auth: { user: smtp.user, pass: smtp.pass },
    });
  }

  async emailContainer(fileName: string, subject: string) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${fileName}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject: subject,
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: convert(html),
    };

    await this.transporter().sendMail(mailOptions);
  }

  async sendWelcomeEmail(): Promise<void> {
    await this.emailContainer(
      "welcomeEmail",
      "Welcome new user. Please verify you account"
    );
  }

  async sendPasswordReset(): Promise<void> {
    await this.emailContainer(
      "passwordReset",
      "Your password reset token (valid for 10 minutes)"
    );
  }
}
