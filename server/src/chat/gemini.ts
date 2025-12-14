import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import { Request, Response } from "express";

export async function gemini(req: Request, res: Response) {
  try {
    console.log("=== GEMINI SERVER REQUEST ===");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { input, instructions } = req.body;
    const file = req.file;

    if (!input) {
      console.log("No input provided");
      return res.status(400).json({ error: "no input" });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.log("No Gemini API key");
      return res.status(500).json({ error: "No API key" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    let prompt = input;
    if (instructions) {
      prompt = `${instructions}\n\nUsuário: ${input}`;
    }

    let parts: any[] = [{ text: prompt }];

    // Se há arquivo, adicionar ao prompt
    if (file) {
      console.log("Processing file:", file.originalname, file.mimetype);
      const fileBuffer = fs.readFileSync(file.path);
      const mimeType = file.mimetype;

      parts.push({
        inlineData: {
          data: fileBuffer.toString("base64"),
          mimeType: mimeType,
        },
      });

      // Limpar arquivo temporário
      fs.unlinkSync(file.path);
    }

    console.log("Calling Gemini API...");
    const geminiResult = await model.generateContentStream(parts);

    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    if (geminiResult && geminiResult.stream) {
      await streamToStdout(geminiResult.stream, res);
    } else {
      console.log("No stream result");
      res.end("Erro: Sem resposta do Gemini");
    }
  } catch (err) {
    console.log("error in Gemini chat: ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(500).end("Erro interno: " + errorMessage);
  }
}

export async function streamToStdout(stream: any, res: Response) {
  for await (const chunk of stream) {
    const chunkText = chunk.text();
    if (chunkText) {
      res.write(chunkText);
    }
  }
  res.end();
}
