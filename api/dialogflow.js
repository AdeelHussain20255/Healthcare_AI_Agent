const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { queryResult } = req.body;
    const intentName = queryResult.intent.displayName;
    const parameters = queryResult.parameters;
    const outputContexts = queryResult.outputContexts;

    console.log(`Intent detected on Vercel: ${intentName}`);

    if (intentName === 'patient.email.confirm') {
        try {
            let allParams = {};
            Object.assign(allParams, parameters);

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
                html: `<h3>Appointment Confirmed!</h3><p>Dear ${patient_name}, your appointment for ${slot} is booked.</p>`
            };
            await transporter.sendMail(mailOptions);

            return res.json({
                fulfillmentText: `Success, ${patient_name}! Your appointment for ${slot} is confirmed. Check your email at ${email}.`
            });
        } catch (err) {
            console.error("Vercel Error:", err);
            return res.json({ fulfillmentText: "Error processing appointment on server." });
        }
    }

    return res.json({ fulfillmentText: queryResult.fulfillmentText });
}
