import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

(async function () {
    const { data, error } = await resend.emails.send({
        from: process.env.FROM_MAIL!,
        to: ['delivered@resend.dev'],
        subject: 'Website down alert!',
        html: '<strong>Its down!</strong>',
    });

    if (error) {
        return console.error({ error });
    }

    console.log({ data });
})();