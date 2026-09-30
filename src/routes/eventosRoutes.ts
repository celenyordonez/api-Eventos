import { Request, Response, Router } from "express";
import prisma from "../prismaClient";

const eventoRouter = Router();

// Criar um novo evento
eventoRouter.post("/", async (req: Request, res: Response) => {
  const { nome, descricao, local, palestrantes } = req.body;

  try {
    if (!nome || !descricao || !local || !Array.isArray(palestrantes) || palestrantes.length === 0) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos para cadastrar o evento."
      });
    }

    const novoEvento = await prisma.evento.create({
      data: {
        nome,
        descricao,
        local,
        palestrantes: {
          create: palestrantes.map((id: number) => ({
            palestrante: {
              connect: {
                id: Number(id)
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

    res.status(201).json({
      mensagem: "cadastro concluído com sucesso",
      evento: novoEvento
    });

  } catch (error) {
    console.error("Erro no cadastro:", error);

    res.status(500).json({
      mensagem: "Não foi possível cadastrar o evento."
    });
  }
});


// Mostrar todos os eventos
eventoRouter.get("/", async (_req: Request, res: Response) => {
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

    res.status(200).json(listaEventos);

  } catch (error) {
    console.error("Erro ao carregar eventos:", error);

    res.status(500).json({
      mensagem: "Não foi possível carregar os eventos."
    });
  }
});


// Procurar um evento específico
eventoRouter.get("/:id", async (req: Request, res: Response) => {
  const eventoId = Number(req.params.id);

  try {
    const resultado = await prisma.evento.findUnique({
      where: {
        id: eventoId
      },
      include: {
        palestrantes: {
          include: {
            palestrante: true
          }
        }
      }
    });

    if (!resultado) {
      return res.status(404).json({
        mensagem: "Evento não encontrado."
      });
    }

    res.status(200).json(resultado);

  } catch (error) {
    console.error("Erro na busca:", error);

    res.status(500).json({
      mensagem: "Erro ao consultar o evento."
    });
  }
});


// Alterar um evento
eventoRouter.put("/:id", async (req: Request, res: Response) => {
  const eventoId = Number(req.params.id);
  const { nome, descricao, local, palestrantes } = req.body;

  try {
    if (!nome || !descricao || !local || !Array.isArray(palestrantes) || palestrantes.length === 0) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos para continuar."
      });
    }

    const evento = await prisma.evento.findUnique({
      where: {
        id: eventoId
      }
    });

    if (!evento) {
      return res.status(404).json({
        mensagem: "Evento não encontrado."
      });
    }

    // Primeiro retiramos os vínculos antigos
    await prisma.eventoPalestrante.deleteMany({
      where: {
        eventoId
      }
    });

    const eventoAlterado = await prisma.evento.update({
      where: {
        id: eventoId
      },
      data: {
        nome,
        descricao,
        local,
        palestrantes: {
          create: palestrantes.map((id: number) => ({
            palestrante: {
              connect: {
                id: Number(id)
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

    res.status(200).json({
      mensagem: "Evento atualizado com sucesso.",
      evento: eventoAlterado
    });

  } catch (error) {
    console.error("Erro ao editar:", error);

    res.status(500).json({
      mensagem: "Não foi possível atualizar o evento."
    });
  }
});


// Apagar um evento
eventoRouter.delete("/:id", async (req: Request, res: Response) => {
  const eventoId = Number(req.params.id);

  try {
    const evento = await prisma.evento.findUnique({
      where: {
        id: eventoId
      }
    });

    if (!evento) {
      return res.status(404).json({
        mensagem: "Evento não encontrado."
      });
    }

    await prisma.evento.delete({
      where: {
        id: eventoId
      }
    });

    res.status(200).json({
      mensagem: "Evento excluído com sucesso."
    });

  } catch (error) {
    console.error("Erro ao excluir:", error);

    res.status(500).json({
      mensagem: "Não foi possível excluir o evento."
    });
  }
});

export default eventoRouter;