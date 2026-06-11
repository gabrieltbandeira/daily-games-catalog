export function readFiltersFromURL() {
  const params = new URLSearchParams(window.location.search)

  return {
    categories: params.get('cat') ? params.get('cat').split(',').filter(Boolean) : [],
    tags:       params.get('tag') ? params.get('tag').split(',').filter(Boolean) : [],
    lang:       params.get('lang') ? params.get('lang').split(',').filter(Boolean) : [],
    search:     params.get('q') ?? '',
  }
}

export function writeFiltersToURL({ categories, tags, lang, search }) {
  const params = new URLSearchParams()

  if (categories.length) params.set('cat', categories.join(','))
  if (tags.length)       params.set('tag', tags.join(','))
  if (lang.length)       params.set('lang', lang.join(','))
  if (search)            params.set('q', search)

  const qs = params.toString()
  const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
  window.history.replaceState(null, '', url)
}
