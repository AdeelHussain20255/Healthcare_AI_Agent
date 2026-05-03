const express = require('express');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Nodemailer Setup
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.get('/', (req, res) => {
    res.send("Jinnah Hospital Webhook is running!");
});

// --- WEBHOOK FOR DIALOGFLOW ---
// This handles saving to Supabase and sending Emails
app.post('/dialogflow', async (req, res) => {
    const queryResult = req.body.queryResult;
    const intentName = queryResult.intent.displayName;
    const parameters = queryResult.parameters;
    const outputContexts = queryResult.outputContexts;

    console.log(`Intent detected: ${intentName}`);

    if (intentName === 'patient.email.confirm') {
        try {
            let allParams = {};
            Object.assign(allParams, parameters);

            // Extract parameters from context if they aren't in the direct queryResult
            if (outputContexts) {
                outputContexts.forEach(context => {
                    if (context.parameters) {
                        Object.assign(allParams, context.parameters);
                    }
                });
            }

            const { patient_name, email, symptom, severity, duration, age, slot } = allParams;

            // 1. Save to Supabase
            const { error } = await supabase
                .from('appointments')
                .insert([{
                    patient_name: patient_name || 'N/A',
                    email: email,
                    symptoms: symptom || 'N/A',
                    severity: severity || 'N/A',
                    duration: duration || 'N/A',
                    age: age ? (age.amount || age) : null,
                    appointment_slot: slot || 'N/A'
                }]);

            if (error) console.error("Supabase Error:", error);

            // 2. Send Email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Appointment Confirmation - Jinnah Hospital',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #2563eb;">Appointment Confirmed!</h2>
                        <p>Dear <strong>${patient_name}</strong>,</p>
                        <p>Your appointment has been successfully scheduled at Jinnah Hospital Karachi.</p>
                        <hr style="border: 0; border-top: 1px solid #eee;">
                        <p><strong>Details:</strong></p>
                        <ul>
                            <li><strong>Symptom:</strong> ${symptom}</li>
                            <li><strong>Time Slot:</strong> ${slot}</li>
                        </ul>
                        <p>Please arrive 15 minutes early. If you need to reschedule, please contact us.</p>
                        <p style="font-size: 12px; color: #666;">This is an automated message from the Jinnah AI Assistant.</p>
                    </div>
                `
            };
            await transporter.sendMail(mailOptions);

            return res.json({
                fulfillmentText: `Success, ${patient_name}! I've booked your slot for ${slot} and sent a confirmation email to ${email}.`
            });
        } catch (err) {
            console.error("Internal Error:", err);
            return res.json({ fulfillmentText: "I'm sorry, I encountered an error while booking your appointment." });
        }
    }

    res.json({ fulfillmentText: queryResult.fulfillmentText });
});

app.listen(PORT, () => {
    console.log(`Webhook server running on port ${PORT}`);
});