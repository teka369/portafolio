import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, email, mensaje } = body;

    // Validate the data
    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "guarinromerojuandavid@gmail.com",
      subject: `Nuevo mensaje de contacto: ${nombre}`,
      text: `
Nuevo mensaje desde el formulario de contacto del portfolio:

Nombre: ${nombre}
Email: ${email}

Mensaje:
${mensaje}
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #00ff41;">Nuevo mensaje desde el portfolio</h2>
          <hr style="border-color: #1e1e32;" />
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border-color: #1e1e32;" />
          <p><strong>Mensaje:</strong></p>
          <p>${mensaje.replace(/\n/g, "<br>")}</p>
        </div>
      `.trim(),
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Error al enviar el mensaje" },
      { status: 500 }
    );
  }
}
