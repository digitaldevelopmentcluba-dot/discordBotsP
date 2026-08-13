export async function getAllNewsPosts() {
  return (await datastore.getAsync(`newsPosts`)) ?? [];
}

export async function getNewsPostById(id: string) {
  const posts = await getAllNewsPosts();
  return posts.find((p : any) => p.id === id) ?? null;
}

export async function addNewsPost(post : any) {
  return await datastore.updateAsync(`newsPosts`, (old) => {
    const posts = old ?? [];
    posts.push(post);
    return posts;
  });
}

export function validateNewsPost(body : any) {
  const errors : Record<string, any> = {};

  const requiredStrings = [`title`, `author`, `content`];
  for (const field of requiredStrings) {
    if (!body[field] || typeof body[field] !== `string` || body[field].trim() === ``) {
      errors[field] = `${field} is required`;
    }
  }

  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags)) {
      errors.tags = `tags must be an array`;
    } else if (!body.tags.every((t : any) => typeof t === `string`)) {
      errors.tags = `tags must contain only strings`;
    }
  }

  if (body.thumbnail !== undefined) {
    if (typeof body.thumbnail !== `string`) {
      errors.thumbnail = `thumbnail must be a string`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
