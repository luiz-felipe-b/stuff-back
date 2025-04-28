import { AnyPgColumn, BooleanColumn, DateColumn, TextColumn } from "drizzle-orm/pg-core";
import { z } from "zod";
import { ZodToDrizzleColumnMap } from "../mapping/zod-to-drizzle-column";

/**
 * Extrai o tipo interno de um ZodType, com suporte a tipos aninhados
 */
type ExtractZodType<T> = 
  T extends z.ZodString ? string :
  T extends z.ZodBoolean ? boolean :
  T extends z.ZodDate ? Date :
  T extends z.ZodNumber ? number :
  T extends z.ZodOptional<infer U> ? ExtractZodType<U> | undefined :
  T extends z.ZodNullable<infer U> ? ExtractZodType<U> | null :
  T extends z.ZodDefault<infer U> ? ExtractZodType<U> :
  T extends z.ZodEffects<infer U> ? ExtractZodType<U> :
  T extends z.ZodArray<infer U> ? ExtractZodType<U>[] :
  T extends z.ZodObject<infer U> ? { [K in keyof U]: ExtractZodType<U[K]> } :
  T extends z.ZodUnion<infer U> ? ExtractZodType<U[number]> :
  T extends z.ZodEnum<infer U> ? U[number] :
  unknown;

/**
 * Extrai o tipo interno de uma coluna Drizzle
 */
type ExtractDrizzleColumnType<T> = 
  T extends TextColumn<any, infer U> ? U :
  T extends BooleanColumn<any, infer U> ? U :
  T extends DateColumn<any, infer U> ? U :
  unknown;

/**
 * Verifica se o tipo da coluna Drizzle é compatível com o tipo Zod
 */
type IsCompatible<Zod, Drizzle> = 
  ExtractZodType<Zod> extends ExtractDrizzleColumnType<Drizzle> ? true : false;

/**
 * Tipo que valida se as colunas da tabela são compatíveis com o schema Zod
 */
export type ValidateTableAgainstZodSchema<
  TableColumns extends Record<string, AnyPgColumn>,
  ZodSchema extends z.ZodObject<any>
> = {
  [K in keyof z.infer<ZodSchema> & keyof TableColumns]: 
    IsCompatible<ZodSchema["shape"][K], TableColumns[K]> extends true 
      ? TableColumns[K] 
      : never; // Isso fará com que o tipo seja "never" se não for compatível, gerando erro
};