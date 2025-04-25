
// pages/api/sheets/index.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
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
        const sheets = await prisma.timeBoxSheet.findMany({
          where: { userId },
          orderBy: { date: 'desc' },
        });
        return res.status(200).json(sheets);
      } catch (error) {
        return res.status(500).json({ error: "Error al obtener las hojas" });
      }

    case "POST":
      try {
        const { date, priorities, hours, brainDump } = req.body;
        
        // Verificar si ya existe una hoja para esta fecha
        const existingSheet = await prisma.timeBoxSheet.findUnique({
          where: {
            userId_date: {
              userId,
              date: new Date(date),
            },
          },
        });

        if (existingSheet) {
          return res.status(400).json({ error: "Ya existe una hoja para esta fecha" });
        }

        const sheet = await prisma.timeBoxSheet.create({
          data: {
            date: new Date(date),
            priorities,
            hours,
            brainDump,
            userId,
          },
        });
        
        return res.status(201).json(sheet);
      } catch (error) {
        return res.status(500).json({ error: "Error al crear la hoja" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Método ${req.method} no permitido`);
  }
}
