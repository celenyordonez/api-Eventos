import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

// Vincular palestrante a um evento
router.post("/", async (req: Request, res: Response) => {
  const eventoId = Number(req.body.eventoId);
  const palestranteId = Number(req.body.palestranteId);

  if (!eventoId || !palestranteId) {
    return res.status(400).json({
      mensagem: "Informe o evento e o palestrante."
    });
  }

  try {
    const eventoEncontrado = await prisma.evento.findUnique({
      where: {
        id: eventoId
      }
    });

    if (!eventoEncontrado) {
      return res.status(404).json({
        mensagem: "Evento não encontrado."
      });
    }

    const palestranteEncontrado = await prisma.palestrante.findUnique({
      where: {
        id: palestranteId
      }
    });

    if (!palestranteEncontrado) {
      return res.status(404).json({
        mensagem: "Palestrante não encontrado."
      });
    }

    const vinculo = await prisma.eventoPalestrante.findUnique({
      where: {
        eventoId_palestranteId: {
          eventoId,
          palestranteId
        }
      }
    });

    if (vinculo) {
      return res.status(409).json({
        mensagem: "Esse palestrante já participa deste evento."
      });
    }

    const novoVinculo = await prisma.eventoPalestrante.create({
      data: {
        eventoId,
        palestranteId
      }
    });

    return res.status(201).json({
      mensagem: "Palestrante vinculado ao evento com sucesso.",
      vinculo: novoVinculo
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Não foi possível vincular o palestrante."
    });
  }
});

// Desvincular palestrante do evento
router.delete(
  "/:eventoId/:palestranteId",
  async (req: Request, res: Response) => {
    const eventoId = Number(req.params.eventoId);
    const palestranteId = Number(req.params.palestranteId);

    try {
      const vinculo = await prisma.eventoPalestrante.findUnique({
        where: {
          eventoId_palestranteId: {
            eventoId,
            palestranteId
          }
        }
      });

      if (!vinculo) {
        return res.status(404).json({
          mensagem: "Esse palestrante não está vinculado ao evento."
        });
      }

      await prisma.eventoPalestrante.delete({
        where: {
          eventoId_palestranteId: {
            eventoId,
            palestranteId
          }
        }
      });

      return res.status(200).json({
        mensagem: "Palestrante desvinculado do evento."
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensagem: "Não foi possível remover o vínculo."
      });
    }
  }
);

export default router;