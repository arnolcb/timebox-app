// pages/api/sheets/[id].js
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
  const { id } = req.query;

  switch (req.method) {
    case "PUT":
      try {
        const { priorities, hours, brainDump } = req.body;
        
        const sheet = await prisma.timeBoxSheet.update({
          where: { id },
          data: { priorities, hours, brainDump },
        });
        
        return res.status(200).json(sheet);
      } catch (error) {
        return res.status(500).json({ error: "Error al actualizar la hoja" });
      }

    case "DELETE":
      try {
        await prisma.timeBoxSheet.delete({
          where: { id },
        });
        
        return res.status(204).end();
      } catch (error) {
        return res.status(500).json({ error: "Error al eliminar la hoja" });
      }

    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).end(`Método ${req.method} no permitido`);
  }
}