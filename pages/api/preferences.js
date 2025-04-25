// pages/api/preferences.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const userId = session.user.id;

  switch (req.method) {
    case "GET":
      try {
        let preferences = await prisma.userPreferences.findUnique({
          where: { userId },
        });
        
        // Si no existen preferencias, crear unas por defecto
        if (!preferences) {
          preferences = await prisma.userPreferences.create({
            data: {
              userId,
              startHour: 8,
              endHour: 18,
              notifications: true,
              theme: "system",
            },
          });
        }
        
        return res.status(200).json(preferences);
      } catch (error) {
        return res.status(500).json({ error: "Error al obtener preferencias" });
      }

    case "PUT":
      try {
        const { startHour, endHour, notifications, theme } = req.body;
        
        const preferences = await prisma.userPreferences.upsert({
          where: { userId },
          update: { startHour, endHour, notifications, theme },
          create: {
            userId,
            startHour,
            endHour,
            notifications,
            theme,
          },
        });
        
        return res.status(200).json(preferences);
      } catch (error) {
        return res.status(500).json({ error: "Error al actualizar preferencias" });
      }

    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      return res.status(405).end(`Método ${req.method} no permitido`);
  }
}