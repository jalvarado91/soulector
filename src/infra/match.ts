/**
 * Pattern match util
 * 
 * Usage: 
 *  
 *      type Colors = "red" | "yellow" | "orange";
        enum Fruits {
          Banana,
          Apple,
          Orange
        }
        function TestMatch(fruit: Fruits, color: Colors) {
          let apple = match(fruit, {
            [Fruits.Banana]: () => "Banana case",
            [Fruits.Apple]: () => "Apple case",
            [Fruits.Orange]: () => "Orange case"
          });

          let red = match(color, {
            orange: () => "orange",
            red: () => "red",
            yellow: () => "yellow"
          });
        }
 *  
 * 
 * @param matchOn
 * @param cases 
 */
export function match<T extends string | number | symbol, R>(
  matchOn: T,
  cases: Record<T, () => R>
): R {
  const val = cases[matchOn];
  return val();
}
