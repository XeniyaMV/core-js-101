/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function getArea() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const resObj = JSON.parse(json);
  Object.setPrototypeOf(resObj, proto);
  return resObj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class Selector {
  constructor(selector = '') {
    this.selector = selector;
    this.state = -1;
    this.hasElement = false;
    this.selectorOrder = {
      element: 0,
      id: 1,
      class: 2,
      attribute: 3,
      pseudoClass: 4,
      pseudoElement: 5,
    };
  }

  stringify() {
    return this.selector;
  }

  element(value) {
    if (this.hasElement) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if ((this.state !== (-1)) && (this.state > this.selectorOrder.element)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selector = this.selector.concat(`${value}`);
    this.state = this.selectorOrder.element;
    this.hasElement = true;
    return this;
  }

  id(value) {
    if (this.selector.indexOf('id') !== -1) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if ((this.state !== (-1)) && (this.state > this.selectorOrder.id)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selector = this.selector.concat(`#${value}`);
    this.state = this.selectorOrder.id;
    return this;
  }

  attr(value) {
    if ((this.state !== (-1)) && (this.state > this.selectorOrder.attribute)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selector = this.selector.concat(`[${value}]`);
    this.state = this.selectorOrder.attribute;
    return this;
  }

  class(value) {
    if ((this.state !== (-1)) && (this.state > this.selectorOrder.class)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selector = this.selector.concat(`.${value}`);
    this.state = this.selectorOrder.class;
    return this;
  }

  pseudoClass(value) {
    if ((this.state !== (-1)) && (this.state > this.selectorOrder.pseudoClass)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selector = this.selector.concat(`:${value}`);
    this.state = this.selectorOrder.pseudoClass;
    return this;
  }

  pseudoElement(value) {
    if (this.selector.indexOf('::') !== -1) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if ((this.state !== (-1)) && (this.state > this.selectorOrder.pseudoElement)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selector = this.selector.concat(`::${value}`);
    this.state = this.selectorOrder.pseudoElement;
    return this;
  }
}

const cssSelectorBuilder = {

  element(value) {
    const selector = new Selector();
    return selector.element(value);
  },

  id(value) {
    const selector = new Selector();
    return selector.id(value);
  },

  class(value) {
    const selector = new Selector();
    return selector.class(value);
  },

  attr(value) {
    const selector = new Selector();
    return selector.attr(value);
  },

  pseudoClass(value) {
    const selector = new Selector();
    return selector.pseudoClass(value);
  },

  pseudoElement(value) {
    const selector = new Selector();
    return selector.pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new Selector(selector1.stringify().concat(` ${combinator} `, selector2.stringify()));
  },

};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
