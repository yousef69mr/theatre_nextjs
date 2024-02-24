interface Props {
  title: string;
  description?: string;
}
const Heading: React.FC<Props> = (props) => {
  const { title, description } = props;
  return (
    <div>
      {title && (
        <h2 className="text-3xl font-bold tracking-tight capitalize">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default Heading;
