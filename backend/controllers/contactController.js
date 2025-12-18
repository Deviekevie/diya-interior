// contactController.js
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

// Submit a new contact enquiry and send email to admin
export const submitContact = async (req, res) => {
  try {
    const newContact = await Contact.create(req.body);

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your company email
        pass: process.env.EMAIL_PASS  // your email password or app password
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // official admin email
      subject: "New Contact Enquiry Received",
      html: `<h3>New Enquiry</h3>
             <p><strong>Name:</strong> ${req.body.name}</p>
             <p><strong>Email:</strong> ${req.body.email}</p>
             <p><strong>Phone:</strong> ${req.body.phone || "N/A"}</p>
             <p><strong>Message:</strong> ${req.body.message}</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json({ message: "Enquiry submitted successfully" });
  } catch (error) {
    console.error("Submit contact error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch all contact enquiries (for admin dashboard)
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Get all contacts error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
