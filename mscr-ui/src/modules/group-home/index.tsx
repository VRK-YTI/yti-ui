interface GroupHomeProps {
  pid: string;
}
export default function GroupWorkspace({ pid }: GroupHomeProps) {
  {
    return (
      <div>
        <p>This is Group Home {pid}</p>
      </div>
    );
  }
}
