interface Props {
  title: string;
  description?: string;
}
const Heading: React.FC<Props> = (props) => {
  const { title, description } = props;
  return (
    <div>
      {title && (
        <h1 className="text-3xl font-bold tracking-tight capitalize">
          {title}
        </h1>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default Heading;
