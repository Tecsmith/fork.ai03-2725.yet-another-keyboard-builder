import Decimal from 'decimal.js'
import makerjs from 'makerjs'
import { CutoutGenerator } from './CutoutGenerator'

// Basic MX stabilizer cutout

export class StabilizerECGeneric extends CutoutGenerator {

    generate(key, generatorOptions) {

        let keySize = key.width

        if (!key.skipOrientationFix && key.height > key.width) {
            keySize = key.height
        }

        let stab_spacing_left = null
        let stab_spacing_right = null

        if (keySize.gte(8)) {
            stab_spacing_left = stab_spacing_right = new Decimal("66.675")
        }
        else if (keySize.gte(7)) {
            stab_spacing_left = stab_spacing_right = new Decimal("57.15")
        }
        else if (keySize.gte(6.25)) {
            stab_spacing_left = stab_spacing_right = new Decimal("50")
        }
        else if (keySize.gte(6)) {
            if (key.shift6UStabilizers) {
                stab_spacing_left = new Decimal("57.15")
                stab_spacing_right = new Decimal("38.1")
            } else {
                stab_spacing_left = stab_spacing_right = new Decimal("47.625")
            }
        }
        else if (keySize.gte(3)) {
            stab_spacing_left = stab_spacing_right = new Decimal("19.05")
        }
        else if (keySize.gte(2)) {
            // do nothing
        }
        else {
            return null
        }

        let cutouts = null;

        if (stab_spacing_left == null) {

            const pointA = [new Decimal("-16").plus(generatorOptions.kerf).toNumber(), new Decimal("7").minus(generatorOptions.kerf).toNumber()]
            const pointB = [new Decimal("16").plus(generatorOptions.kerf).toNumber(), new Decimal("7").minus(generatorOptions.kerf).toNumber()]
            const pointC = [new Decimal("16").plus(generatorOptions.kerf).toNumber(), new Decimal("-5").minus(generatorOptions.kerf).toNumber()]
            const pointD = [new Decimal("13").plus(generatorOptions.kerf).toNumber(), new Decimal("-7").minus(generatorOptions.kerf).toNumber()]
            const pointE = [new Decimal("-13").plus(generatorOptions.kerf).toNumber(), new Decimal("-7").minus(generatorOptions.kerf).toNumber()]
            const pointF = [new Decimal("-16").plus(generatorOptions.kerf).toNumber(), new Decimal("-5").minus(generatorOptions.kerf).toNumber()]

            var singleCutout = {
                paths: {
                    line1: new makerjs.paths.Line(pointA, pointB),
                    line2: new makerjs.paths.Line(pointB, pointC),
                    line3: new makerjs.paths.Line(pointC, pointD),
                    line4: new makerjs.paths.Line(pointD, pointE),
                    line5: new makerjs.paths.Line(pointE, pointF),
                    line6: new makerjs.paths.Line(pointF, pointA),
                }
            }

            if (generatorOptions.stabilizerFilletRadius.gt(0)) {
                const filletNum = generatorOptions.stabilizerFilletRadius.toNumber()

                singleCutout.paths.fillet1 = makerjs.path.fillet(singleCutout.paths.line1, singleCutout.paths.line2, filletNum)
                singleCutout.paths.fillet2 = makerjs.path.fillet(singleCutout.paths.line2, singleCutout.paths.line3, filletNum)
                singleCutout.paths.fillet3 = makerjs.path.fillet(singleCutout.paths.line3, singleCutout.paths.line4, filletNum)
                singleCutout.paths.fillet4 = makerjs.path.fillet(singleCutout.paths.line4, singleCutout.paths.line5, filletNum)
                singleCutout.paths.fillet5 = makerjs.path.fillet(singleCutout.paths.line5, singleCutout.paths.line6, filletNum)
                singleCutout.paths.fillet6 = makerjs.path.fillet(singleCutout.paths.line6, singleCutout.paths.line1, filletNum)
            }

            singleCutout.paths.circle1 = new makerjs.paths.Circle([16.4, -7.2], 1.0 - generatorOptions.kerf.toNumber())
            singleCutout.paths.circle2 = new makerjs.paths.Circle([-16.4, -7.2], 1.0 - generatorOptions.kerf.toNumber())

            cutouts = {
                models: {
                    "single": singleCutout
                }
            }

            /*
            // Adjusted for 7.05 edges (to fit switch)
            const pathData = `M0,7.05
              L11.927,7.05 A1.075,1.075 0 0 0 12.924,6.348 A0.861,0.929 0 0 1 13.785,5.767 L14.65,5.767 A1.425,1.425 0 0 0 16.075,4.342
              L16.075,-3.258 A1.425,1.425 0 0 0 14.638,-4.683 L14.246,-4.683 A1.725,1.725 0 0 1 12.631,-5.803 A1.875,1.875 0 0 0 10.875,-7.05
              L-10.875,-7.05 A1.875,1.875 0 0 0 -12.631,-5.803 A1.725,1.725 0 0 1 -14.246,-4.683 L-14.638,-4.683 A1.425,1.425 0 0 0 -16.075,-3.258
              L-16.075,4.342 A1.425,1.425 0 0 0 -14.65,5.767 L-13.785,5.767 A0.861,0.929 0 0 1 -12.924,6.348 A1.075,1.075 0 0 0 -11.927,7.05
              L0,7.05 Z`

            const singleCutout = makerjs.model.mirror(makerjs.importer.fromSVGPathData(pathData), false, true)


            singleCutout.paths = singleCutout.paths || {}
            singleCutout.paths.circle1 = new makerjs.paths.Circle([16.40, -7.208], 1.0)
            singleCutout.paths.circle2 = new makerjs.paths.Circle([-16.40, -7.208], 1.0)

            const kerf = generatorOptions.kerf.toNumber()
            cutouts = kerf !== 0
                ? makerjs.model.outline(singleCutout, Math.abs(kerf), 0, kerf > 0)
                : singleCutout

            */

        } else {

            const width = new Decimal("13.6")
            const upperBound = new Decimal("6.95")
            const lowerBound = new Decimal("-6.95")

            const plusHalfWidth = width.dividedBy(new Decimal("2"))
            const minsHalfWidth = width.dividedBy(new Decimal("-2"))

            let upperLeft =  [minsHalfWidth.plus(generatorOptions.kerf).toNumber(), upperBound.minus(generatorOptions.kerf).toNumber()]
            let upperRight = [plusHalfWidth.minus(generatorOptions.kerf).toNumber(), upperBound.minus(generatorOptions.kerf).toNumber()]
            let lowerLeft =  [minsHalfWidth.plus(generatorOptions.kerf).toNumber(), lowerBound.plus(generatorOptions.kerf).toNumber()]
            let lowerRight = [plusHalfWidth.minus(generatorOptions.kerf).toNumber(), lowerBound.plus(generatorOptions.kerf).toNumber()]

            var singleCutout = {
                paths: {
                    lineTop: new makerjs.paths.Line(upperLeft, upperRight),
                    lineBottom: new makerjs.paths.Line(lowerLeft, lowerRight),
                    lineLeft: new makerjs.paths.Line(upperLeft, lowerLeft),
                    lineRight: new makerjs.paths.Line(upperRight, lowerRight)
                }
            }

            if (generatorOptions.stabilizerFilletRadius.gt(0)) {

                const filletNum = generatorOptions.stabilizerFilletRadius.toNumber()

                var filletTopLeft = makerjs.path.fillet(singleCutout.paths.lineTop, singleCutout.paths.lineLeft, filletNum)
                var filletTopRight = makerjs.path.fillet(singleCutout.paths.lineTop, singleCutout.paths.lineRight, filletNum)
                var filletBottomLeft = makerjs.path.fillet(singleCutout.paths.lineBottom, singleCutout.paths.lineLeft, filletNum)
                var filletBottomRight = makerjs.path.fillet(singleCutout.paths.lineBottom, singleCutout.paths.lineRight, filletNum)

                singleCutout.paths.filletTopLeft = filletTopLeft;
                singleCutout.paths.filletTopRight = filletTopRight;
                singleCutout.paths.filletBottomLeft = filletBottomLeft;
                singleCutout.paths.filletBottomRight = filletBottomRight;

            }

            var cutoutLeft = singleCutout;
            var cutoutRight = makerjs.model.clone(singleCutout);

            cutoutLeft = makerjs.model.move(cutoutLeft, [stab_spacing_left.times(-1).toNumber(), 0])
            cutoutRight = makerjs.model.move(cutoutRight, [stab_spacing_right.toNumber(), 0])

            cutouts = {
                models: {
                    "left": cutoutLeft,
                    "right": cutoutRight
                }
            }

        }

        if (cutouts && !key.skipOrientationFix && key.height > key.width) {
            cutouts = makerjs.model.rotate(cutouts, -90)
        }

        return cutouts;
    }

}
