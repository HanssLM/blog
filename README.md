# TechInPulse Blog

> Blog dedicat a les últimes novetats en hardware i tecnologia amb guies pràctiques i anàlisis reals.

---

## Sobre el meu projecte:

**TechInPulse** és un blog modern i dinàmic centrat en el món de la tecnologia, el hardware i les guies pràctiques. Aquest projecte neix de la passió per compartir coneixement sobre les últimes tendències tecnològiques, ressenyes de productes i tutorials útils per a entusiastes de la tecnologia.

### 🎯 Funcionalitats Principales

- **Sistema d'articles** amb navegació intuïtiva
- **Autenticació d'usuaris** amb Firebase Authentication
- **Perfils d'usuari** personalitzats
- **Disseny responsive** per a tots els dispositius
- **Interfície moderna** amb Font Awesome
- **Navegació fàcil** entre seccions
- **Formulari de contacte** per a consultes

---


```
┌─────────────────────────────────────┐
│           TechInPulse               │
│ Blog dedicat a hardware, tecnologia │
│         i guies pràctiques          │
│                                     │
│      Inici  Articles  Sobre mi      │
│      ⭐ Contacte  Perfil  ⭐       │
└─────────────────────────────────────┘
```

### Navegació Principal
- **Inici**: Pàgina principal amb resum del blog
- **Articles**: Llistat de tots els articles publicats
- **Sobre mi**: Informació sobre l'autor del blog
- **Contacte**: Formulari per a contactar amb l'equip 📲
- **Perfil/Configuració**: Gestió del compte d'usuari 🔒

---

### 🛠️ Tecnologías Utilitzades

### Frontend
- **HTML5** - Estructura semàntica del lloc web 📄
- **CSS3** - Estils i disseny responsive 🎨
- **JavaScript** - Interactivitat i funcionalitats dinàmiques 💻
- **Font Awesome** - Icones i elements visuals 📈

### Backend i Serveis
- **Firebase 12.9.0** - Backend com a servei 🌐
  - **Firebase Authentication** - Gestió d'usuaris 🔒
  - **Firebase Firestore** - Base de dades NoSQL 📊
  - **Firebase Hosting** - Allotjament web 📈

### Eines de Desenvolupament
- **Visual Studio Code** - Entorn de desenvolupament 💻
- **Git** - Control de versions 📈
- **Firebase CLI** - Desplegament i gestió 🔧

---

### 🚀 Instal·lació i Ús

### Requisits Previs
- Node.js (versió 14 o superior)
- Compte de Firebase
- Git

### Pas a Pas

#### 1. Clonar el Repositori
```bash
git clone https://github.com/HanssLM/blog.git
cd blog
```

#### 2. Instal·lar Dependències
```bash
npm install
```

#### 3. Configurar Firebase
```bash
# Iniciar sessió a Firebase
firebase login

# Inicialitzar el projecte
firebase init
```

#### 4. Executar en Local
```bash
# Servidor de desenvolupament
firebase serve --only hosting

# O utilitzar un servidor local com Live Server
# a Visual Studio Code
```

#### 5. Desplegar a Producció
```bash
firebase deploy --only hosting
```

---

### 📁 Estructura del Projecte

```
blog/
├── index.html              # Pàgina principal
├── 404.html                # Pàgina d'error 404
├── package.json            # Dependències del projecte
├── firebase.json           # Configuració de Firebase
├── firestore.rules         # Regles de seguretat de Firestore
├── 
├── LAYOUT/                 # Estructura i disseny
│   └── structure/
│       └── columns.css     # Sistema de columnes
├── 
├── css/                    # Fulls d'estil
│   ├── base.css            # Estils base
│   ├── home.css            # Estils de l'inici
│   └── styles.css          # Estils addicionals
├── 
├── js/                     # Fitxers JavaScript
│   ├── firebase.js         # Configuració de Firebase
│   └── nav-auth.js         # Navegació i autenticació
├── 
├── posts/                  # Sistema d'articles
│   ├── posts.html          # Llistat d'articles
│   ├── post.html           # Vista individual d'article
│   ├── css/                # Estils dels articles
│   └── js/                 # Funcionalitat dels articles
├── 
├── about/                  # Secció "Sobre mi"
├── contact/                # Formulari de contacte
├── login/                  # Pàgina d'inici de sessió
├── register/               # Pàgina de registre
├── 
├── img/                    # Imatges del projecte
├── icons/                  # Icones personalitzades
├── .firebase/              # Configuració de Firebase
├── .vscode/                # Configuració de VS Code
└── node_modules/           # Dependències de Node.js
```

---

### 👥 Autors i Contribucions

### 🧑‍💻 Autor Principal
- **Hans Lao Moncusi** - Desenvolupador principal i creador del projecte
  - Contacte: A través del formulari de contacte del blog
  - GitHub: [@HanssLM](https://github.com/HanssLM)
  - Linkedin: [@Hans Lao Moncusi](https://www.linkedin.com/in/hanslaomoncusi/)

### 🤝 Contribucions
Les contribucions són benvingudes! Si vols col·laborar en el projecte:
***

1. **Fork** el repositori
2. Crea una branca per a la teva funcionalitat (`git checkout -b feature/NovaFuncionalitat`)
3. **Commit** els teus canvis (`git commit -m 'Afegint nova funcionalitat'`)
4. **Push** a la branca (`git push origin feature/NovaFuncionalitat`)
5. Obre un **Pull Request**
   
***
---

### 📄 Llicència
Aquest projecte està sota la llicència **MIT License** - pots veure el fitxer [LICENSE](LICENSE) per a més detalls.

```
MIT License

Copyright (c) 2026 Hans L.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

### 🗺️ Roadmap i Millores Futures

### 🎯 Objectius a Curt Termini (Q2 2026)
- Sistema d'autenticació complet
- Disseny responsive
- En curs: Sistema de comentaris als articles
- En curs: Editor de articles en temps real
- Planificat: Sistema de categories i etiquetes

### 🎯 Objectius a Mitjà Termini (Q3-Q4 2026)
- Motor de cerca d'articles
- Panell d'administració per a gestors
- Suport multiidioma (català, castellà, anglès)
- Aplicació mòbil (PWA)
- Sistema de notificacions per a nous articles

### 🎯 Objectius a Llarg Termini (2027)
- Integració amb IA per a recomanacions
- Contingut multimèdia (vídeos, podcasts)
- Sistema de col·laboradors i autors múltiples
- Anàlisi avançada d'usuari i contingut
- Botiga integrada per a productes tecnològics

---

### 🔗 Enllaços d'Interès

- Documentació de Firebase: [https://firebase.google.com/docs](https://firebase.google.com/docs)
- Font Awesome: [https://fontawesome.com](https://fontawesome.com)
- Firebase Hosting: [https://firebase.google.com/products/hosting](https://firebase.google.com/products/hosting)
  
---

### 💬 Feedback i Suport

Si tens alguna pregunta, suggeriment o vols informar d'un problema:

- Contacte directe: Utilitza el formulari de contacte del blog
- Issues de GitHub: [Obre una issue](https://github.com/HanssLM/blog/issues)
- Discussions: [Participa a les discussions](https://github.com/HanssLM/blog/discussions)

---

<div align="center">

 **🚀 Gràcies per visitar TechInPulse! 🚀**

*Si t'ha agradat el projecte, no dubtis a donar-li una ⭐ a GitHub!*

[⬆ Torna a l'inici](#-techinpulse)

</div>
