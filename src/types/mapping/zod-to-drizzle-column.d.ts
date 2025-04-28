import { text, boolean, AnyPgColumn } from 'drizzle-orm/pg-core'; // Assuming PostgreSQL, adjust if using a different database
import z, { date } from 'zod';

/**
 * Mapeia tipos do Zod para tipos de coluna do Drizzle
 */
export type ZodToDrizzleColumnMap<T> = 
  T extends z.ZodString
    ? ReturnType<typeof text>
    : T extends z.ZodBoolean
      ? ReturnType<typeof boolean>
      : T extends z.ZodDate
        ? ReturnType<typeof date>
        : T extends z.ZodOptional<infer U>
          ? ZodToDrizzleColumnMap<U> // Deve manter o tipo interno para opcionais
          : T extends z.ZodNullable<infer U>
            ? ZodToDrizzleColumnMap<U> // Deve manter o tipo interno para nullables
            : AnyPgColumn; // Fallback para outros tipos