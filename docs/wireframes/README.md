# Lara Cuenta — Wireframe summary

Source: `wireframes.pdf` (FGU, Digital Innovation MSc, summative activity 2, Sept 2026).
Regenerate the assets with `python scripts/extract_wireframes.py`.

Lara Cuenta is a nano-outlet about the memory, heritage and people of Lara (Venezuela),
built on **Wix** from a template. Photography is the protagonist; no permanent sidebar —
content is organized in blocks and cards.

## Site map

| Page | Wireframe | Summary |
|---|---|---|
| Home | [home.png](images/home.png) | [home.md](home.md) |
| Blog (listing) | [blog.png](images/blog.png) | [blog.md](blog.md) |
| Blog post | [post.png](images/post.png) | [post.md](post.md) |

Main menu (top, all pages): **Home · Blog · About · Contact**, social icons in header and/or footer.

## Brand system

| Token | Hex | Use |
|---|---|---|
| `cream` | _to define_ | Page backgrounds (reading comfort) |
| `orange` | `#CF7739` | Buttons, highlights |
| `sun` | `#EEB33F` | Accents, indicators |
| `terracotta` | `#BD6A42` | Categories, interactive elements |
| `brown` | `#54331C` | High-contrast zones |
| `text` | `#422818` | Body text |

Hex values come from `logo/build_logo.py`. The cream background is mentioned in the
document but not specified.

- Headings: **DM Serif Display**
- Body, menus, buttons: **Montserrat**

## Editorial categories

1. Lara then and now (*Lara antes y ahora*)
2. Heritage and memory of places (*Patrimonio y memoria de los lugares*)
3. Stories of our people (*Historias de nuestra gente*)
4. Customs and cultural memory (*Costumbres y memoria cultural*)

## Shared components

- **Header**: logo (left), 3–4 menu links (center), 4 social icons (right). Active page
  is highlighted in the menu.
- **Footer**: logo + outlet info · two link columns (main links, policies) ·
  newsletter subscription (email + button) · social icons.
- **Post card**: image, title, date, short excerpt, link to the full post.
