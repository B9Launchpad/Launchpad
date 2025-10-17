# Frontend — Launchpad
This documentation explains the standards undertaken in coding of frontend apps for Launchpad. Please read this file carefully before development.

### Note: Please keep Server-Side Rendering in mind whilst making changes or developing this frontend.
#### What does this mean?
To keep this project Server-Side Rendering (SSR)-friendly, you need to avoid the direct use of elements that a server does not have, for example, ``window``, ``document``and so on.
If you would like or require to use elements that are not available to the SSR API, please provide them into ``useEffect`` hook or filter SSR with ``typeof window`` checks to provide workarounds for SSR, compatibility, for example:

```ts
// I need to check if <html> has class "dark".

const [hasClassDark, setHasClassDark] = useState<boolean>(false /* value to ALWAYS be provided for SSR-compatibility */);

useEffect(() => {
    // non-SSR logic goes here, as SSR can't see what's in useEffect
    setHasClassDark(document.documentElement.classList.contains("dark"));
}, [])
```

For more information on this topic, there is a [very helpful article](https://stephencook.dev/blog/using-window-in-react-ssr/) about this.

## Technologies used
This project had been migrated to **NextJS** from CRA to avoid security issues in connection with deprecated CRA framework. Please note some of the features are still in their further compatbility enhancement stage and this documentation might not perfectly reflect the nature of working with NextJS.

Frontend makes use of **TSX (React Typescript)** by default. Please make sure to avoid using standard or incompatible JavaScript code and/or libraries.

For styling, the **standard CSS** option is currently the enforced one. This means you must avoid using TailWind, SCSS, etc. as it will be incompatible with the Launchpad. If you have any suggestions on improving stylesheet coding, please create a ticket in the **Issues** section of this repository.

For localisation, **i18n** method and the [corresponding library](https://www.i18next.com/) are being used. Please avoid putting text in directly without leaving a note to localise and/or translate:

```ts
// TODO: i18n : localise/translate
```

Currently, there are 4 languages supported: Standard German, British English, Russian and Polish. Their localisation files may be found here:
```
/public/locales/en/*.json
/public/locales/de/*.json
/public/locales/pl/*.json
/public/locales/ru/*.json
```

Configuration for i18n is at ``src/i18n/index.ts``.

For animations, feel free to use standard CSS. However, knowledge of [react-spring](https://www.react-spring.dev/docs) is recommended to implement more difficult or two-way animations that would take more effort and logical difficulties in CSS and TSX files (i.e. manipulating height transition animations, etc.)

## Dealing with components

Please note that there is a strict component structure in Launchpad's frontend. This means you must avoid putting code directly into a page's file, and opt for writing a reusable component for it instead. Even if the use of your directly inputted code is unique and would not appear anywhere else, it is still recommended to put it into a component instead, as it might be useful later.

All components must be stored in child folders of ``/src/components``.

### Component structure

There is a file hierarchy with components:
``` plaintext
/components/common 		# For components that are used ubiquitously throughout Launchpad. (i.e. buttons, input fields, checkboxes, etc.)

/components/icons 		# For all SVG icon components. For example, logos, settings icon, arrows, etc.

/components/layout 		# For layout components AND components that are used in these layouts. For example,
 				sidebar items but NOT profile overview (as it is used elsewhere too). 

/components/modules 		# For module-specific components.

```

## Pages Structure and Router
Base pages **must** all be located in ``/src/app/[route]``. Pages must be structured by module, or for miscellaneous pages that do no appear in modules please use the ``misc`` folder (consider another approach after NextJS app router implementation).

Router must be structured into separate folders for each microservice/module. Please note I will be implementing support for plug-in modules as part of my plan to make this app accessible for developers with little experience with Launchpad, those plug-in modules shall not appear in the router.  

``` plaintext
src/          
├── app/                   # App router, + layout each pointing to a microservice module/page.
│   ├── login/
│   ├── listings/
│   └── layout.tsx 	   # layout shell
├── components/            # Components used in the application.
│   ├── common/
│   ├── icons/
│   ├── layout/
│   └── ...
├── config/                # Application configurations (WIP).
├── contexts/              # React contexts.
├── functions/             # hooks (e.g. use...) and one-off utilities (to be migrated).
├── hooks/             	   # hooks (e.g. use...)
├── i18n/             	   # i18next + react-i18next localisation configs
├── tests/
└── utils/		   # Utility functions
```

## Backend caveat
Currently, the app relies on a separate C++ backend framework serving as an API endpoint for the frontend to communicate with. This means that this repository contains merely the frontend with hard-coded fetch functions, meaning this app will not work completely on its own as it does not make a connection to databases, etc.

We have not yet found an accessible solution to this problem to support plug-in modules by third-party developers as planned in the future. 

# How to run:

**Docker note:** As of right now, frontend isn't Docker-supported. However, it can be run and tested locally using the commands below

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test` (work in progress to re-implement)

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run start`

After your application is built using `npm run build` command as listed above, it can be started using `npm run start`. This will deploy a [localhost:3000](http://localhost:3000) frontend server to render the application from the `build` directory.

# Happy coding!
