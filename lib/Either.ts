export enum EitherTag {
    LEFT = "left",
    RIGHT = "right",
}

export class Either <L,R>{
    value: L|R
    tag: EitherTag

    constructor(value: L | R, tag: EitherTag) {
        this.value = value;
        this.tag = tag;
    }

    isLeft() {
        return this.tag == EitherTag.LEFT
    }
    isRight() {
        return this.tag == EitherTag.RIGHT
    }

    static left = <L1,R1>(value: L1): Either<L1, R1> => new Either<L1, R1>(value, EitherTag.LEFT);
    static right = <L1,R1>(value: R1): Either<L1, R1> => new Either<L1, R1>(value, EitherTag.RIGHT);

    is() {
        return this.tag
    }
}
