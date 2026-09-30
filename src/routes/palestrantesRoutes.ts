import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const palestrantes = Router();

// Criar palestrante
palestrantes.post("/", async (req: Request, res: Response) => {
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({
      mensagem: "Nome e e-mail devem ser informados."
    });
  }

  try {
    const cadastrado = await prisma.palestrante.findUnique({
      where: { email }
    });

    if (cadastrado) {
      return res.status(409).json({
        mensagem: "Já existe um palestrante com este e-mail."
      });
    }

    const novoPalestrante = await prisma.palestrante.create({
      data: {
        nome,
        email
      }
    });

    return res.status(201).json(novoPalestrante);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Não foi possível cadastrar o palestrante."
    });
  }
});

// Listar palestrantes
palestrantes.get("/", async (_req: Request, res: Response) => {
  try {
    const lista = await prisma.palestrante.findMany({
      orderBy: {
        nome: "asc"
      }
    });

    return res.json(lista);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Não foi possível carregar os palestrantes."
    });
  }
});

// Buscar palestrante por ID
palestrantes.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      mensagem: "ID inválido."
    });
  }

  try {
    const resultado = await prisma.palestrante.findUnique({
      where: { id }
    });

    if (!resultado) {
      return res.status(404).json({
        mensagem: "Palestrante não encontrado."
      });
    }

    return res.json(resultado);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao consultar o palestrante."
    });
  }
});

// Atualizar palestrante
palestrantes.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nome, email } = req.body;

  if (Number.isNaN(id)) {
    return res.status(400).json({
      mensagem: "ID inválido."
    });
  }

  if (!nome || !email) {
    return res.status(400).json({
      mensagem: "Nome e e-mail devem ser informados."
    });
  }

  try {
    const atual = await prisma.palestrante.findUnique({
      where: { id }
    });

    if (!atual) {
      return res.status(404).json({
        mensagem: "Palestrante não encontrado."
      });
    }

    const outro = await prisma.palestrante.findUnique({
      where: { email }
    });

    if (outro && outro.id !== id) {
      return res.status(409).json({
        mensagem: "Este e-mail já pertence a outro palestrante."
      });
    }

    const atualizado = await prisma.palestrante.update({
      where: { id },
      data: {
        nome,
        email
      }
    });

    return res.json(atualizado);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Não foi possível atualizar o palestrante."
    });
  }
});

// Excluir palestrante
palestrantes.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      mensagem: "ID inválido."
    });
  }

  try {
    const encontrado = await prisma.palestrante.findUnique({
      where: { id }
    });

    if (!encontrado) {
      return res.status(404).json({
        mensagem: "Palestrante não encontrado."
      });
    }

    await prisma.palestrante.delete({
      where: { id }
    });

    return res.json({
      mensagem: "Palestrante removido."
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Não foi possível excluir o palestrante."
    });
  }
});

export default palestrantes;