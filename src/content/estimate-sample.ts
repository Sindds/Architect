import { PROJECTS } from './projects'

const vista = PROJECTS.find((p) => p.slug === 'vista')!

/** Пример для образцов договора и сметы: VISTA под ключ, без опций (CONTENT-SPEC §5.2, §5.4). */
export const ESTIMATE_SAMPLE = {
  name: vista.name,
  area: vista.area,
  terrace: vista.terrace,
  style: vista.style,
  tier: 'turnkey' as const,
  addons: [],
  floors: vista.floors,
  bathrooms: vista.bathrooms,
}
