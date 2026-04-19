'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

export async function triggerRevalidation(tag?: string) {
  if (tag) {
    revalidateTag(tag, 'max');
  } else {
    revalidatePath('/', 'layout');
  }
}
