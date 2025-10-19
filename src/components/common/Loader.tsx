import Image from "next/image";
import { useEffect, useState } from "react";
import { SVGProps } from "react"


const SuspenseLoader: React.FC = () => {
    const [hasExceededTimeout, setHasExceededTimeout] = useState<boolean>(false)

    useEffect(() => {
        setTimeout(() => {
            setHasExceededTimeout(true);
        }, 5000)
    }, [])

    return (
        <div className="loader__screen">
            <div className="loader__content">
                <h1 className={`loader__text ${hasExceededTimeout ? 'visible' : ''}`}>We are processing your request...</h1>
                {/*<Image alt={"Loader animation"} width={200} height={150} src={"/static/loader.gif"}></Image>*/}
                <LoaderImage className="loader__image"/>
                {/*<div className="loading-bar">
                    <div className="loading-bar__progress"></div>
                </div>*/}
                <em className={`loader__text ${hasExceededTimeout ? 'visible' : ''}`}>This may take a few seconds</em>
            </div>
        </div>
    )
}


const LoaderImage = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 300 150"
    {...props}
  >
    <defs>
      <animateMotion
        repeatCount="indefinite"
        dur="1.001001s"
        begin="0s"
        xlinkHref="#_R_G_L_1_G"
        keyTimes="0;0.2733;0.4167;0.5625333;0.8333333;1"
        path="M248.28 42.34 C259.37,71.66 226.44,110.39 168.41,129.05 C114.22,146.48 62.38,134.32 52.59,107.1 C40.63,73.88 83.14,35.5 132.45,20.39 C187.51,3.52 237.58,14.06 248.28,42.34 C248.28,42.34 248.28,42.34 248.28,42.34 "
        keyPoints="0;0.25;0.5;0.75;1;1"
        keySplines="0.333 0 0.667 0.427;0.333 0.306 0.667 0.653;0.333 0.348 0.667 0.695;0.333 0.574 0.667 1;0 0 1 1"
        calcMode="spline"
      />
      <animateTransform
        repeatCount="indefinite"
        dur="1.001001s"
        begin="0s"
        xlinkHref="#_R_G_L_1_G"
        attributeName="transform"
        from="3 3"
        to="3 3"
        type="scale"
        additive="sum"
        keyTimes="0;1"
        values="3 3;3 3"
        keySplines="0 0 1 1"
        calcMode="spline"
      />
      <animateMotion
        repeatCount="indefinite"
        dur="1.001001s"
        begin="0s"
        xlinkHref="#_R_G_L_0_G"
        keyTimes="0;0.2733;0.4167;0.5625333;0.8333333;1"
        path="M98.28 -32.66 C109.37,-3.34 76.44,35.39 18.41,54.05 C-35.78,71.48 -87.62,59.32 -97.41,32.1 C-109.37,-1.12 -66.86,-39.5 -17.55,-54.61 C37.51,-71.48 87.58,-60.94 98.28,-32.66 C98.28,-32.66 98.28,-32.66 98.28,-32.66 "
        keyPoints="0;0.25;0.5;0.75;1;1"
        keySplines="0.333 0 0.667 0.427;0.333 0.306 0.667 0.653;0.333 0.348 0.667 0.695;0.333 0.574 0.667 1;0 0 1 1"
        calcMode="spline"
      />
      <animateTransform
        repeatCount="indefinite"
        dur="1.001001s"
        begin="0s"
        xlinkHref="#_R_G_L_0_G"
        attributeName="transform"
        from="1.87 1.87"
        to="1.87 1.87"
        type="scale"
        additive="sum"
        keyTimes="0;1"
        values="1.87 1.87;1.87 1.87"
        keySplines="0 0 1 1"
        calcMode="spline"
      />
      <animate
        attributeType="XML"
        attributeName="opacity"
        dur="1s"
        from={0}
        to={1}
        xlinkHref="#time_group"
      />
    </defs>
    <g id="_R_G">
      <g id="_R_G_L_2_G" className="loader__trace" transform=" translate(150, 75) translate(0, 0)">
        <path
          id="_R_G_L_2_G_D_0_P_0"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          strokeOpacity={1}
          d=" M98.28 -32.66 C87.58,-60.94 37.51,-71.48 -17.55,-54.61 C-66.86,-39.5 -109.37,-1.12 -97.41,32.1 C-87.62,59.32 -35.78,71.48 18.41,54.05 C76.44,35.39 109.37,-3.34 98.28,-32.66z "
        />
      </g>
      {/*<g id="_R_G_L_1_G">
        <path
          id="_R_G_L_1_G_D_0_P_0"
          fillOpacity={1}
          fillRule="nonzero"
          d=" M5.84 0 C5.84,3.22 3.22,5.84 0,5.84 C-3.22,5.84 -5.83,3.22 -5.83,0 C-5.83,-3.22 -3.22,-5.83 0,-5.83 C3.22,-5.83 5.84,-3.22 5.84,0z "
        />
      </g>*/}
      <g
        id="_R_G_L_0_G_N_3_T_0"
        transform=" translate(150, 75) translate(0, 0)"
      >
        <g id="_R_G_L_0_G">
          <path
            className="loader__circle"
            id="_R_G_L_0_G_D_0_P_0"
            fillOpacity={1}
            fillRule="nonzero"
            d=" M5.84 0 C5.84,3.22 3.22,5.84 0,5.84 C-3.22,5.84 -5.83,3.22 -5.83,0 C-5.83,-3.22 -3.22,-5.83 0,-5.83 C3.22,-5.83 5.84,-3.22 5.84,0z "
          />
        </g>
      </g>
    </g>
    <g id="time_group" />
  </svg>
)

export default SuspenseLoader;