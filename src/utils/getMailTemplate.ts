


export const getPwdRecoverEmailTemp = ({frontURL, token}: {frontURL: string, token: string}) => {
    return ` <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8" />
                <title>Recuperar contraseña - Gato Feliz</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body style="margin: 0; padding: 0; background-color: #fff9db; font-family: Arial, sans-serif;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 40px 10px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
                        <!-- Header -->
                        <tr>
                        <td align="center" style="background-color: #fff9db; padding: 20px;">
                            <img src="https://res.cloudinary.com/dqc0yku26/image/upload/v1754523931/logogf2_zv8jnt.png" alt="Logo Gato Feliz" width="80" height="80" style="display:block;" />
                            <h2 style="margin: 10px 0 0; color: #F37021;">Recuperar tu contraseña</h2>
                        </td>
                        </tr>

                        <!-- Cuerpo -->
                        <tr>
                        <td style="padding: 30px 40px; color: #333;">
                            <p style="font-size: 16px; margin: 0 0 12px;">
                            ¡Hola! Hemos recibido una solicitud para restablecer tu contraseña en <strong>Gato Feliz Venezuela</strong>.
                            </p>
                            <p style="font-size: 15px; margin: 0 0 20px;">
                            Para continuar, haz clic en el botón de abajo. Este enlace es válido por 30 minutos.
                            </p>

                            <!-- Botón -->
                            <table role="presentation" cellspacing="0" cellpadding="0">
                            <tr>
                                <td align="center" style="border-radius: 30px;" bgcolor="#F37021">
                                <a
                                    href="${frontURL}/auth/newPassword?token=${token}"
                                    target="_blank"
                                    style="font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 12px 24px; display: inline-block; border-radius: 30px;"
                                >
                                    Restablecer Contraseña
                                </a>
                                </td>
                            </tr>
                            </table>

                            <p style="font-size: 13px; color: #999; margin-top: 24px;">
                            Si no solicitaste este cambio, puedes ignorar este mensaje. Tu contraseña actual seguirá funcionando.
                            </p>
                        </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                        <td align="center" style="background-color: #fff9db; padding: 16px; font-size: 13px; color: #666;">
                            Fundación Gato Feliz Venezuela 🐾<br />
                            Síguenos en Instagram: <strong>@gatofelizvenezuela</strong>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                </table>
            </body>
            </html>`
}

export const getAdoptionRequestEmailTemp = ({ frontURL, requestId }: { frontURL: string, requestId: string }) => {
    return `<!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8" />
                <title>Solicitud de Adopción - Gato Feliz</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body style="margin: 0; padding: 0; background-color: #fff9db; font-family: Arial, sans-serif;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 40px 10px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
                        <!-- Header -->
                        <tr>
                        <td align="center" style="background-color: #fff9db; padding: 20px;">
                            <img src="https://res.cloudinary.com/dqc0yku26/image/upload/v1754523931/logogf2_zv8jnt.png" alt="Logo Gato Feliz" width="80" height="80" style="display:block;" />
                            <h2 style="margin: 10px 0 0; color: #F37021;">Solicitud de Adopción</h2>
                        </td>
                        </tr>

                        <!-- Cuerpo -->
                        <tr>
                        <td style="padding: 30px 40px; color: #333;">
                            <p style="font-size: 16px; margin: 0 0 12px;">
                            ¡Hola! Hemos recibido una solicitud de adopción en <strong>Gato Feliz Venezuela</strong>.
                            </p>
                            <p style="font-size: 15px; margin: 0 0 20px;">
                            Para continuar, haz clic en el botón de abajo. Este enlace es válido por 30 minutos.
                            </p>

                            <!-- Botón -->
                            <table role="presentation" cellspacing="0" cellpadding="0">
                            <tr>
                                <td align="center" style="border-radius: 30px;" bgcolor="#F37021">
                                <a
                                    href="${frontURL}/adoption/confirm?requestId=${requestId}"
                                    target="_blank"
                                    style="font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 12px 24px; display: inline-block; border-radius: 30px;"
                                >
                                    Confirmar Solicitud
                                </a>
                                </td>
                            </tr>
                            </table>

                            <p style="font-size: 13px; color: #999; margin-top: 24px;">
                            Si no solicitaste este cambio, puedes ignorar este mensaje. Tu solicitud actual seguirá en espera.
                            </p>
                        </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                        <td align="center" style="background-color: #fff9db; padding: 16px; font-size: 13px; color: #666;">
                            Fundación Gato Feliz Venezuela 🐾<br />
                            Síguenos en Instagram: <strong>@gatofelizvenezuela</strong>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                </table>
            </body>
            </html>`
}