import React from 'react'
import camelCase from 'camelcase'
import cssParse from 'css-parse-no-fs'


import Svg, {
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text,
  Use,
  Defs,
  Stop,
} from 'react-native-svg'

const mapping = {
  'svg': Svg,
  'circle': Circle,
  'ellipse': Ellipse,
  'g': G,
  'line': Line,
  'path': Path,
  'rect': Rect,
  'symbol': Symbol,
  'text': Text,
  'polygon': Polygon,
  'polyline': Polyline,
  'linearGradient': LinearGradient,
  'radialGradient': RadialGradient,
  'use': Use,
  'defs': Defs,
  'stop': Stop
}

function extractViewbox (markup) {
  const viewBox = markup.attributes
    ? Object.values(markup.attributes)
      .filter((attr) => attr.name === 'viewBox')[0]
    : false

  const vbSplits = viewBox ? viewBox.value.split(' ') : false
  if (!vbSplits) {
    return {}
  }

  return {
    // width: `${vbSplits[2]}`,
    // height: `${vbSplits[3]}`,
    width:'100%',
    height:'100%',
    viewBox: viewBox.value
  }
}

function getRulesForClass(cssRules, className) {
  const rules = cssRules.filter((rule) => {
    if (rule.selectors.indexOf('.'+className) > -1) {
      return true
    } else {
      return false
    }
  })
  return rules;
}

function getCssRulesForAttr (attr, cssRules) {
  let rules = []
  if (attr.name === 'id') {
    const idname = '#' + attr.value

    rules = cssRules.filter((rule) => {
      if (rule.selectors.indexOf(idname) > -1) {
        return true
      } else {
        return false
      }
    })
  } else if (attr.name === 'class') {
    const classesList = attr.value.split(' ');

    classesList.forEach((className) => {
      const classRules = getRulesForClass(cssRules, className);
      if(classRules.length>0) {
        rules = rules.concat(classRules);
      }
    })
  } else if (attr.name==='style') {
    const styleProp = cssParse('stylePropInline{'+attr.value+'}');
    rules = styleProp.stylesheet.rules;
  }

  return rules
}

function addNonCssAttributes (markup, cssPropsResult) {
  // again look at the attributes and pick up anything else that is not related to CSS
  const attrs = []
  Object.values(markup.attributes).forEach((attr) => {
    if (!attr || !attr.name) {
      return
    }

    //eq. xlixnk:href - name='xlixnk:href', localName='href' - so we should use localName
    // const propertyName = camelCase(attr.name)
    const propertyName = camelCase(attr.localName)
    if (propertyName === 'class' || propertyName === 'id') {
      return
    }

    if (cssPropsResult.cssProps.indexOf(propertyName) > -1) {
      return
    }

    attrs.push({
      name: propertyName,
      value: `${attr.value}`
    })
  })

  return attrs
}

function findApplicableCssProps (markup, config) {
  const cssProps = []
  const attrs = []
  Object.values(markup.attributes).forEach((attr) => {
    const rules = getCssRulesForAttr(attr, config.cssRules)
    if (rules.length === 0) {
      return
    }

    rules.forEach((rule) => {
      rule.declarations.forEach((declaration) => {
        const propertyName = camelCase(declaration.property)
        attrs.push({
          name: propertyName,
          value: `${declaration.value}`
        })
        cssProps.push(propertyName)
      })
    })
  })
  return { cssProps, attrs }
}

function findId (markup) {
  const id = Object.values(markup.attributes).find((attr) => attr.name === 'id')
  return id && id.value
}

function findFill (markup) {
  const id = Object.values(markup.attributes).find((attr) => attr.name === 'fill')
  return id && id.value
}

function findProperty (markup, propertyName) {
  const id = Object.values(markup.attributes).find((attr) => attr.name === propertyName)
  return id && id.value
}

class Traverse extends React.Component {
  constructor(props) {
    super(props);
    this.elementRef = React.createRef();
  }

  render() {
    const {markup, config, i = 0, onPress, colorsMap} = this.props;

    if (!markup || !markup.nodeName || !markup.tagName) {
      return null
    }
    const tagName = markup.nodeName
    const idName = findId(markup)
    if (idName && config.omitById && config.omitById.includes(idName)) {
      return null
    }

    let attrs = []
    if (tagName === 'svg') {
      const viewBox = extractViewbox(markup)
      attrs.push({
        name: 'width',
        value: config.width || viewBox.width
      })
      attrs.push({
        name: 'height',
        value: config.height || viewBox.height
      })
      attrs.push({
        name: 'viewBox',
        value: config.viewBox || viewBox.viewBox || '0 0 50 50'
      })
    } else if (tagName === 'g') {
      // if(idName) {
      //   attrs.push({
      //     name: 'onPress',
      //     value: () => onPress(idName, elementRef)
      //   })
      // }
    } else {
      // otherwise, if not SVG, check to see if there is CSS to apply.
      const cssPropsResult = findApplicableCssProps(markup, config)
      const additionalProps = addNonCssAttributes(markup, cssPropsResult)
      const className = findProperty(markup, 'class')

      // if(idName && className && className.includes('circle')) {
      if (idName && className && className.includes('circle')) {
        additionalProps.push({
          name: 'onPress',
          value: () => onPress(idName, this.elementRef)
        })
      }

      // add to the known list of total attributes.
      attrs = [...attrs, ...cssPropsResult.attrs, ...additionalProps]
    }

    // map the tag to an element.
    const Elem = mapping[tagName.toLowerCase()]

    // Note, if the element is not found it was not in the mapping.
    if (!Elem) {
      return null
    }

    const children = (Elem === Text && markup.childNodes.length === 1)
        ? markup.childNodes[0].data
        : markup.childNodes.length ? Object.values(markup.childNodes).map((child) => {
          // return traverse(child, config, ++i, onPress, colorsMap)
          return <Traverse markup={child} config={config} i={i+1} key={i+1+Math.random()} onPress={onPress} colorsMap={colorsMap}/>
        }).filter((node) => {
          return !!node
        }) : []

    const elemAttributes = {}
    attrs.forEach((attr) => {
      elemAttributes[attr.name] = attr.value
    })

    const k = i + Math.random()
    return <Elem ref={this.elementRef} testProp={1} {...elemAttributes} key={k}>{children}</Elem>
  }
}

export { extractViewbox, getCssRulesForAttr, findApplicableCssProps, addNonCssAttributes }

export default (dom, cssAst, config, onPress,colorsMap) => {
  config = Object.assign({}, config, {
    cssRules: (cssAst && cssAst.stylesheet && cssAst.stylesheet.rules) || []
  })
  return <Traverse markup={dom.documentElement} config={config} i={0} onPress={onPress} colorsMap={colorsMap}/>
  // return traverse(dom.documentElement, config, 0,onPress,colorsMap)
}
