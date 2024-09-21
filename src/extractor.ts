import {
    type Node,
    type ParameterDeclaration,
    type BindingElement,
    createSourceFile,
    forEachChild,
    isBindingElement,
    isFunctionLike,
    isIdentifier,
    isObjectBindingPattern,
    ScriptTarget,
} from "typescript";

export enum Type {
    OBJECT = 'object',
    VARIABLE = 'variable',
}

type VariableResult = {
    type: Type.VARIABLE;
    result: string;
};

type ObjectResult = {
    type: Type.OBJECT;
    result: Result[];
};

export type Result = VariableResult | ObjectResult;

const factory = () => {
    const extractElement = (element: BindingElement | ParameterDeclaration): Result => {
        if (isIdentifier(element.name)) {
            const result = isBindingElement(element) && element.propertyName
                ? element.propertyName.getText()
                : element.name.text;

            return {
                type: Type.VARIABLE,
                result,
            };
        }

        if (isObjectBindingPattern(element.name)) {
            const result = element.name.elements.map(extractElement).filter(Boolean);

            return {
                type: Type.OBJECT,
                result,
            };
        }
    };

    const extract = <T>(fn: T): Result[] => {
        const source = stringify(fn);
        const sourceFile = createSourceFile('extractor.ts', source, ScriptTarget.ES5, true);

        const visit = (node: Node): Result[] => {
            if (isFunctionLike(node)) {
                return node.parameters.flatMap(extractElement);
            }

            return forEachChild<Result[]>(node, visit);
        };

        return visit(sourceFile);
    };

    const stringify = <T>(fn: T): string => {
        return Function.prototype.toString.call(fn);
    };

    return {
        extract,
    };
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 01.04.2022
 * Time: 10:05
 */
export default factory;
