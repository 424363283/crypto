export const Input = ({
    label,
    value,
    onChange,
    rule,
    placeholder,
  }: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => any;
    rule: RegExp;
  }) => {
    return (
      <>
        <div className='my-input'>
          <div className='label'>{label}</div>
          <input
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              const next = e.target.value;
              if (rule.test(next)) onChange(next);
            }}
          />
        </div>
        <style jsx>{`
          .my-input {
            width: 100%;
            .label {
              margin-bottom: 10px;
            }
            input {
              height: 40px;
              border-radius: 5px;
              background-color: var(--fill-3);
              padding-left: 13px;
              box-shadow: unset;
              border: 0;
              width: 100%;
              font-size: 14px;
              color: var(--text-primary);
              &::placeholder {
                color: var(--text-secondary);
              }
            }
          }
        `}</style>
      </>
    );
  };
  
