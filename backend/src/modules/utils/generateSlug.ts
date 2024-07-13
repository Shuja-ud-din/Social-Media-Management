const generateSlug = (title: string) => {
  return title
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/[^\w\-]+/g, '') // Remove non-word characters (except dashes)
    .replace(/\-\-+/g, '-') // Replace multiple dashes with a single dash
    .replace(/^-+/, '') // Remove leading dashes
    .replace(/-+$/, '') // Remove trailing dashes
}

export default generateSlug
