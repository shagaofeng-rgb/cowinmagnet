# SEO and indexation baseline

- The public sitemap source already separates `blog` and `news` CMS types.
- Existing legacy News records include older articles that require later quality triage; this implementation does not delete or redirect them.
- New automated News will include one canonical URL, title, description, H1, source panel, original publication date and editorial disclaimer, and will be added only to the News sitemap after frontend delivery verification.
