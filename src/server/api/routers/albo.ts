import Logger from "~/lib/logger";
import { z } from 'zod';
import prisma from "~/utils/db";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";


export const alboRouter = createTRPCRouter({
  
    list : publicProcedure
    .query(async () => {
      try {
        return (await prisma.alboTrofei.findMany({
          orderBy: [
            { stagione: 'desc' },
            { campionato: 'desc'},
            { champions: 'desc'},
            { secondo: 'desc'},
            { terzo: 'desc'},
          ]
        })).map(c => ({
          stagione: c.stagione,
          squadra: c.nomeSquadra,
          presidente: c.presidente,
          campionato: c.campionato ? 'X' : '',
          champions: c.champions ? 'X' : '',
          secondo: c.secondo ? 'X' : '',
          terzo: c.terzo ? 'X' : ''
        }));
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

    get : publicProcedure
    .input(z.object({ 
      idSquadra: z.number() 
    }))
    .query(async (opts) => {
      try {
        const utente = await prisma.utenti.findUnique({
          where: {
            idUtente: opts.input.idSquadra
          }
        });
        if (utente) {
          return {
            squadra: utente.nomeSquadra,
            campionato: utente.Campionato,
            champions: utente.Champions,
            secondo: utente.Secondo,
            terzo: utente.Terzo
          };
        }
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    })
});