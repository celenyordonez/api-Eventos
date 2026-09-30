import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

// Criar evento
router.post("/", async (req: Request, res: Response) => {
  const { nome, descricao, local, palestrantes } = req.body;

  if (!nome || !descricao || !local || !Array.isArray(palestrantes) || palestrantes.length === 0) {
    return res.status(400).json({
      mensagem: "Preencha todos os campos do evento."
    });
  }

  try {
    const novoEvento = await prisma.evento.create({
      data: {
        nome,
        descricao,
        local,
        palestrantes: {
          create: palestrantes.map((id: number) => ({
            palestrante: {
              connect: {
                id
              }
            }
          }))
        }
      },
      include: {
        palestrantes: {
          include: {
            palestrante: true
          }
        }
      }
    });

    return res.status(201).json({
      mensagem: "Evento cadastrado com sucesso.",
      evento: novoEvento
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Não foi possível cadastrar o evento."
    });
  }
});

// Listar eventos
router.get("/", async (_req: Request, res: Response) => {
  try {
    const listaEventos = await prisma.evento.findMany({
      include: {
        palestrantes: {
          include: {
            palestrante: true
          }
        }
      },
      orderBy: {
        id: "desc"
      }
    });

    return res.status(200).json(listaEventos);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Não foi possível listar os eventos."
    });
  }
});

// Buscar evento pelo ID
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      mensagem: "ID do evento inválido."
    });
  }

  try {
    const evento = await prisma.evento.findUnique({
      where: {
        id
      },
      include: {
        palestrantes: {
          include: {
            palestrante: true
          }
        }
      }
    });

    if (!evento) {
      return res.status(404).json({
        mensagem: "Evento não encontrado."
      });
    }

    return res.status(200).json(evento);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Não foi possível buscar o evento."
    });
  }
});

// Editar evento
router.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nome, descricao, local, palestrantes } = req.body;

  if (Number.isNaN(id)) {
    return res.status(400).json({
      mensagem: "ID do evento inválido."
    });
  }

  if (!nome || !descricao || !local || !Array.isArray(palestrantes) || palestrantes.length === 0) {
    return res.status(400).json({
      mensagem: "Preencha todos os campos do evento."
    });
  }

  try {
    const eventoAtual = await prisma.evento.findUnique({
      where: {
        id
      }
    });

    if (!eventoAtual) {
      return res.status(404).json({
        mensagem: "Evento não encontrado."
      });
    }

    await prisma.eventoPalestrante.deleteMany({
      where: {
        eventoId: id
      }
    });

    const eventoAtualizado = await prisma.evento.update({
      where: {
        id
      },
      data: {
        nome,
        descricao,
        local,
        palestrantes: {
          create: palestrantes.map((palestranteId: number) => ({
            palestrante: {
              connect: {
                id: palestranteId
              }
            }
          }))
        }
      },
      include: {
        palestrantes: {
          include: {
            palestrante: true
          }
        }
      }
    });

    return res.status(200).json({
      mensagem: "Evento atualizado com sucesso.",
      evento: eventoAtualizado
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Não foi possível atualizar o evento."
    });
  }
});

// Excluir evento
router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      mensagem: "ID do evento inválido."
    });
  }

  try {
    const evento = await prisma.evento.findUnique({
      where: {
        id
      }
    });

    if (!evento) {
      return res.status(404).json({
        mensagem: "Evento não encontrado."
      });
    }

    await prisma.eventoPalestrante.deleteMany({
      where: {
        eventoId: id
      }
    });

    await prisma.evento.delete({
      where: {
        id
      }
    });

    return res.status(200).json({
      mensagem: "Evento removido com sucesso."
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Não foi possível excluir o evento."
    });
  }
});

export default router;