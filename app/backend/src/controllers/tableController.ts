import { Request, Response } from "express";
import Table from "../models/Table";

// Criar mesa
export const createTable = async (req: Request, res: Response) => {
  try {
    const { numero, capacidade } = req.body;

    // Verificar se mesa já existe
    const tableExists = await Table.findOne({ numero });
    if (tableExists) {
      return res.status(400).json({ error: "Número de mesa já existe" });
    }

    const table = await Table.create({
      numero,
      capacidade,
    });

    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar mesa" });
  }
};

// Listar todas as mesas
export const getAllTables = async (req: Request, res: Response) => {
  try {
    const tables = await Table.find().sort({ numero: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar mesas" });
  }
};

// Buscar mesa por ID
export const getTableById = async (req: Request, res: Response) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ error: "Mesa não encontrada" });
    }
    res.json(table);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar mesa" });
  }
};

// Atualizar mesa
export const updateTable = async (req: Request, res: Response) => {
  try {
    const { numero, capacidade } = req.body;

    // Verificar se novo número já existe em outra mesa
    if (numero) {
      const tableExists = await Table.findOne({
        numero,
        _id: { $ne: req.params.id },
      });
      if (tableExists) {
        return res.status(400).json({ error: "Número de mesa já existe" });
      }
    }

    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { numero, capacidade },
      { new: true, runValidators: true }
    );

    if (!table) {
      return res.status(404).json({ error: "Mesa não encontrada" });
    }

    res.json(table);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar mesa" });
  }
};

// Excluir mesa
export const deleteTable = async (req: Request, res: Response) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);

    if (!table) {
      return res.status(404).json({ error: "Mesa não encontrada" });
    }

    res.json({ message: "Mesa excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir mesa" });
  }
};
