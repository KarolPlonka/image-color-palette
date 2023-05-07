export default interface ControlProps {
    title: string;
    value: number;
    setValue: (value: number) => void;
    min: number;
    max: number;
    tooltip?: string;
}