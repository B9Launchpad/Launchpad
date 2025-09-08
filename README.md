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
Frontend makes use of **TSX (React Typescript)** by default. Please make sure to avoid using standard or incompatible JavaScript code and/or libraries.

For styling, the **standard CSS** option is currently the enforced one. This means you must avoid using TailWind, SCSS, etc. as it will be incompatible with the Launchpad. If you have any suggestions on improving stylesheet coding, please create a ticket in the **Issues** section of this repository.

For localisation, **i18n** method and the [corresponding library](https://www.i18next.com/) are being used. Please avoid putting text in directly without leaving a note to localise and/or translate:

```ts
// TODO: i18n : localise/translate
```

Currently, there are 4 languages supported: Standard German, British English, Russian and Polish. Their localisation files may be found here:
```
/src/i18n/en.json
/src/i18n/de.json
/src/i18n/pl.json
/src/i18n/ru.json
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
Pages **must** all be located in ``/src/pages``. Pages must be structured by module, or for miscellaneous pages that do no appear in modules please use the ``misc`` folder.

Router must be structured into separate folders for each microservice/module, with ``App.tsx`` only referring to the top-level routes that guide into route folders. Here is an example of a possible route structure **(please do not use this without further ponder about appropriateness. THIS IS AN EXAMPLE)** 

``` plaintext
src/
├── App.tsx                # Main router + layout shell
├── routes/                # Top-level routes, each pointing to a microservice module
│   ├── AuthRoutes.tsx
│   ├── DashboardRoutes.tsx
│   └── BillingRoutes.tsx
├── services/              # API clients grouped by service
│   ├── auth/
│   ├── billing/
│   └── ...
└── features/              # Each feature is a slice
    ├── auth/
    │   ├── pages/
    │   ├── components/
    │   └── AuthRoutes.tsx
    ├── dashboard/
    └── billing/
```


# How to run:

As of right now, frontend isn't Docker-supported. However, it can be run and tested locally using the commands below

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

# Happy coding!
