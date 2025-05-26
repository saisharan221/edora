from sqlmodel import SQLModel, Table, Column, ForeignKey

channel_user_link = Table(
    "channel_user_link",
    SQLModel.metadata,
    Column("channel_id", ForeignKey("channel.id"), primary_key=True),
    Column("user_id", ForeignKey("user.id"), primary_key=True),
) 