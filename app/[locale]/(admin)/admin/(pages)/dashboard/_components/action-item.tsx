// action-item.tsx
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import { FaClock, FaUser } from "react-icons/fa6";
import { ACTION_ITEM_CONFIG, ActionType } from "./action-item.config";

type ActionItemProps = {
  type: ActionType;
  title: string;
  description: string;
  user: string;
  time: string;
};

const ActionItem = ({
  type,
  title,
  description,
  user,
  time,
}: ActionItemProps) => {
  const config = ACTION_ITEM_CONFIG[type];

  return (
    <Item variant="outline" className={config.bg}>
      <ItemContent>
        <div className="flex items-center gap-4">
          <div className={config.iconColor}>{config.icon}</div>

          <div className="space-y-1">
            <h2 className="text-sm font-bold">{title}</h2>

            <p className={config.text}>{description}</p>

            <div className="flex gap-4">
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <FaUser />
                {user}
              </p>
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <FaClock />
                {time}
              </p>
            </div>
          </div>
        </div>
      </ItemContent>

      <ItemActions>
        <Button className={`${config.buttonBg} ${config.buttonHover}`}>
          {config.buttonText}
        </Button>
      </ItemActions>
    </Item>
  );
};

export default ActionItem;
