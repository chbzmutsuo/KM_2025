import {Config} from 'tailwindcss'

import {CSSProperties} from 'react'

const getAnimationProps = () => {
  type keyFrameType = {
    [key: number]: CSSProperties
  }
  type animationType = {
    [key: string]: {
      keyframe: keyFrameType
      animationPropString?: string
    }
  }

  const animatinos: animationType = {
    'hoverUp-and-vanish': {
      keyframe: {
        0: {transform: 'translateX(-100%)', opacity: 0},
        20: {transform: 'translateX(30%)', opacity: 1},
        100: {transform: 'translateX(100%)', opacity: 0},
      },
      animationPropString: '1s ease-in-out forwards',
    },
    'slide-in-bottom': {
      keyframe: {0: {transform: 'translateY(10%)', opacity: 0}, 100: {transform: 'translateY(0)', opacity: 1}},
      animationPropString: '0.5s ease-in-out',
    },
    'fade-in': {
      keyframe: {0: {opacity: '0'}, 100: {opacity: '1'}},
    },
    scaleUp: {
      keyframe: {0: {transform: `scale(80%)`, opacity: 0}, 100: {}},
    },
    leftToRight: {
      keyframe: {
        0: {transform: 'translateX(-100%)', opacity: 0},
        100: {transform: 'translateX(0)', opacity: 1},
      },
    },
    'rb-to-center': {
      keyframe: {
        0: {transform: 'translate(100%, 100%)', position: 'fixed'},
        100: {
          position: 'fixed',
          transform: 'translate(-50%, -50%)',
          top: '50%',
          left: '50%',
          width: '90%',
          maxWidth: 500,
        },
      },
    },
  }
  const keyframes = {}
  const animation = {
    pulse: 'pulse 3s  infinite',
    ping: 'ping 1.5s  ease-out  infinite',
  }
  Object.keys(animatinos).forEach(key => {
    const {animationPropString} = animatinos[key]
    const theKeyfram = {...animatinos[key].keyframe}
    Object.keys(theKeyfram).forEach(key => {
      const value = theKeyfram[key]
      theKeyfram[`${key}%`] = value
      delete theKeyfram[key]
    })
    keyframes[key] = theKeyfram
    animation[key] = `${key}${animationPropString ?? ' 1s ease-in-out forwards'}`
  })

  const result = {
    animation,
    keyframes,
  }

  return result
}

export const tail_color = {
  KM: {
    main: '#407eb9',
    light: '#ebf5fb',
    text: 'white',
  },
  kaizen: {
    green: {
      main: '#5e8d19',
      light: '#ebfbeb',
    },
    cool: {
      main: '#175793',
      light: '#ebf5fb',
    },

    warm: {
      main: '#c28f0e',
      light: '#fffacf',
    },
  },
  LED: {
    main: '#326493',
    light: '#90BCE4',
    text: '#ffffff',
  },
  Advantage: {
    main: '#326493',
    light: '#90BCE4',
    text: '#ffffff',
  },
  Grouping: {
    main: '#f8869d',
    light: '#f2d0ff',
    text: '#ffffff',
  },

  estimate: {
    main: '#F07F2A',
    light: '#ffb87a',
    text: '#ffffff',
  },
  hanamaru: {
    main: '#EE7738',
    light: '#ffd0b7',
    text: '#ffffff',
  },

  Century: {
    main: '#806747',
    light: '#f0e7d2',
    text: '#ffffff',
  },

  white: '#ffffff',
  blue: {
    main: '#5189bd',
    light: '#90BCE4',
  },

  green: {
    main: '#26a237',
    light: '#ecfcde',
  },
  sub: {
    main: '#34342E',
    light: '#f0f0f0',
  },

  gray: {
    '100': '#ededed',
    light: '#f7f7f7',
    main: '#636363',
  },
  error: {
    main: '#f65353',
    light: 'rgb(255, 173, 162)',
  },

  orange: {
    main: '#fb996f',
    light: '#fbc9b3',
  },
  yellow: {
    main: '#cb9f32',
    light: '#fbe7b3',
  },
  warning: {
    main: '#fec128',
    light: '#fbe7b3',
  },
  info: {},

  success: {
    main: '#3B7053',
    light: '#ecfcde',
  },

  dark: {},
}

export const tail_width = {
  min: '260px',
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1530px',
  '3xl': '1920px',
}
export const tail_fontSize: any = {
  xs: ['0.7rem', {lineHeight: '1rem'}],
  sm: ['0.8rem', {lineHeight: '1.25rem'}],
  base: ['1rem', {lineHeight: '1.5rem'}],
  lg: ['1.125rem', {lineHeight: '1.75rem'}],
  xl: ['1.25rem', {lineHeight: '1.75rem'}],
  '2xl': ['1.5rem', {lineHeight: '2rem'}],
  '3xl': ['1.875rem', {lineHeight: '2.25rem'}],
  '4xl': ['2.25rem', {lineHeight: '2.5rem'}],
  '5xl': ['3rem', {lineHeight: '1rem'}],
  '6xl': ['3.75rem', {lineHeight: '1rem'}],
  '7xl': ['4.5rem', {lineHeight: '1rem'}],
  '8xl': ['6rem', {lineHeight: '1rem'}],
  '9xl': ['8rem', {lineHeight: '1rem'}],
}
export const tail_shadoow = {
  xs: `0px 1px 2px 0px #5E646D`,
  sm: `0px 1px 5px 0px #5E646D`,
  md: `0 2px 2px 0px #5E646D`,
  DEFAULT: `1px 1px 3px 0.5px #5E646D`,
  lg: `5px 5px 10px -3px #5E646D`,
  xl: `0 20px 25px -5px #5E646D`,
  '2xl': `0 25px 50px -12px #5E646D;`,
}
export const tail_textShadoow = {
  '.text-shadow': {
    textShadow: '0px 1px 2px #c0c0c0',
  },
  '.text-shadow-md': {
    textShadow: '0px 3px 3px #c0c0c0',
  },
  '.text-shadow-lg': {
    textShadow: '0px 5px 3px #c0c0c0',
  },
  '.text-shadow-xl': {
    textShadow: '0px 7px 3px #c0c0c0',
  },
  '.text-shadow-2xl': {
    textShadow: '0px 10px 3px #c0c0c0',
  },
  '.text-shadow-none': {
    textShadow: 'none',
  },
}

const config: Config = {
  darkMode: ['class'],
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        xl: '4rem',
      },
    },
    extend: {
      width: {
        ...tail_width,
      },
      minWidth: {
        ...tail_width,
      },
      maxWidth: {
        ...tail_width,
      },
      screens: {
        ...tail_width,
      },
      boxShadow: {
        ...tail_shadoow,
      },
      fontSize: {
        ...tail_fontSize,
      },
      colors: {
        primary: {
          main: '#407eb9',
          light: '#ebf5fb',
          text: 'white',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        ...tail_color,
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      ...getAnimationProps(),
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      // borderRadius: {
      //   lg: 'var(--radius)',
      //   md: 'calc(var(--radius) - 2px)',
      //   sm: 'calc(var(--radius) - 4px)',
      // },
    },
  },

  plugins: [
    function ({addUtilities}) {
      const newUtilities = {...tail_textShadoow}

      addUtilities(newUtilities)
    },
    require('tailwindcss-animate'),
  ],
}

export default config
