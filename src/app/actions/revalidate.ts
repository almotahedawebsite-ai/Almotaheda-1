'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

export async function triggerRevalidation(tag?: string) {
  if (tag) {
    revalidateTag(tag, '');
  } else {
    revalidatePath('/', 'layout');
  }
}
