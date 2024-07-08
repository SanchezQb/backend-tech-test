import { Media } from "src/media/entities/media.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: true })
    profilePictureUrl?: string;

    @OneToMany(() => Media, media => media.user, { cascade: true })
    media: Media[]

    @ManyToMany(() => Media, media => media.viewedBy)
    @JoinTable()
    viewedMedia: Media[]

    @CreateDateColumn()
    createdAt: Date


    @ManyToMany(() => User, user => user.friends)
    @JoinTable({
        name: 'user_followers',
        joinColumn: {
            name: 'followerId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'friendId',
            referencedColumnName: 'id'
        }
    })
    followers: User[];

    @ManyToMany(() => User, user => user.followers)
    friends: User[];

    @UpdateDateColumn()
    updatedAt: Date
}
